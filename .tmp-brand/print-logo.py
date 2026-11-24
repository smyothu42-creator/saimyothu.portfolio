from PIL import Image, ImageFilter
import numpy as np

KIT = '/Users/saimyothu/claude-workspace/uz-brand/UZ Brand Kit/01 Logo/PNG/Large 3000px/'
OUT = 'public/case/uz-branding/'
S = 1600


def homography(src, dst):
    A, b = [], []
    for (x, y), (u, v) in zip(src, dst):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); b.append(v)
    return np.linalg.solve(np.array(A, float), np.array(b, float))


def bilinear(quad, u, v):
    tl, tr, br, bl = [np.array(p, float) for p in quad]
    return (tl * (1 - u) * (1 - v) + tr * u * (1 - v) + br * u * v + bl * (1 - u) * v)


def stamp(base, face_quad, logo_name, u0, u1, v0, v1, density=0.92, white=False, soft=0.8):
    H, W = base.shape[:2]
    # logo cropped to ink
    lg = Image.open(KIT + logo_name + '.png')
    a = np.array(lg)
    ys, xs = np.where(a[:, :, 3] > 8)
    lg = lg.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    # target quad inside the face
    dst = [bilinear(face_quad, u0, v0), bilinear(face_quad, u1, v0),
           bilinear(face_quad, u1, v1), bilinear(face_quad, u0, v1)]
    w = int(np.hypot(*(np.array(dst[1]) - dst[0])))
    h = int(np.hypot(*(np.array(dst[3]) - dst[0])))
    lg = lg.resize((w * 2, h * 2), Image.LANCZOS)  # supersample
    lw, lh = lg.size
    src = [(0, 0), (lw, 0), (lw, lh), (0, lh)]
    c = homography(src, [tuple(p) for p in dst])
    # invert: dst -> src rect coords
    M = np.array([[c[0], c[1], c[2]], [c[3], c[4], c[5]], [c[6], c[7], 1.0]])
    Mi = np.linalg.inv(M)
    Mi = Mi / Mi[2, 2]
    coeffs = (Mi[0, 0], Mi[0, 1], Mi[0, 2], Mi[1, 0], Mi[1, 1], Mi[1, 2], Mi[2, 0], Mi[2, 1])
    warped = lg.convert('RGBA').transform((W, H), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    wa = np.array(warped, float)
    alpha = wa[:, :, 3] / 255.0
    alpha = np.array(Image.fromarray((alpha * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(soft))) / 255.0
    rgb = wa[:, :, :3] / 255.0
    # uneven ink density, low frequency
    rng = np.random.default_rng(7)
    noise = Image.fromarray((rng.random((H // 8, W // 8)) * 255).astype('uint8')).resize((W, H), Image.BICUBIC)
    n = np.array(noise, float) / 255.0
    n = np.array(Image.fromarray((n * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(6)), float) / 255.0
    dens = density * (0.93 + 0.14 * n)
    if white:
        out = base * (1 - alpha[..., None]) + (base + (1 - base) * 1.0) * alpha[..., None]
        out = base + (1.0 - base) * alpha[..., None] * dens[..., None] * 0.95
    else:
        out = base * (1 - alpha[..., None] * dens[..., None] * (1 - rgb))
    return np.clip(out, 0, 1)


def load(path):
    im = Image.open(path).convert('RGB').resize((S, S), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=2.2, percent=55, threshold=2))
    return np.array(im, float) / 255.0


def save(arr, name):
    rng = np.random.default_rng(3)
    g = rng.normal(0, 0.006, arr.shape[:2])[..., None]
    im = Image.fromarray((np.clip(arr + g, 0, 1) * 255).astype('uint8'))
    im.save(OUT + name, quality=92, subsampling=1)
    print(name, im.size)


k = S / 1024.0

# --- gift box: primary monogram, mulberry ink, on lid top face
box = load('/Users/saimyothu/vibe_images/uz-giftbox-base_1795113159203_a7122540.png')
lid = [(175 * k, 412 * k), (322 * k, 228 * k), (865 * k, 330 * k), (668 * k, 573 * k)]
# primary aspect ~ 1873w x 2244h
box = stamp(box, lid, 'UZ-Logo-Primary-Mulberry', 0.5 - 0.15, 0.5 + 0.15, 0.5 - 0.195, 0.5 + 0.195, density=0.84)
save(box, 'use-20-box.jpg')

# --- bag: stacked logo with name, below the ribbon
bag = load('/Users/saimyothu/vibe_images/uz-bag-base_1795113180566_e0809a75.png')
face = [(247 * k, 232 * k), (700 * k, 238 * k), (768 * k, 855 * k), (238 * k, 812 * k)]
# stacked aspect ~2119w x 1752h -> w/h 1.21
bag = stamp(bag, face, 'UZ-Logo-Stacked-Mulberry', 0.5 - 0.23, 0.5 + 0.23, 0.685 - 0.142, 0.685 + 0.142, density=0.86)
save(bag, 'use-21-bag.jpg')
