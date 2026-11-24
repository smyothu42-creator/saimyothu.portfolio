from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import numpy as np, os

SRC = '/Users/saimyothu/claude-workspace/portfolio-revamp/.tmp-refs/cand'
OUT = '/Users/saimyothu/claude-workspace/portfolio-revamp/.tmp-refs/build/out'
os.makedirs(OUT, exist_ok=True)

MULBERRY = (72, 43, 59)

def solve_perspective(dst, src):
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -x * u, -y * u])
        A.append([0, 0, 0, x, y, 1, -x * v, -y * v])
        B += [u, v]
    A = np.asarray(A, float)
    B = np.asarray(B, float)
    c = np.linalg.solve(A, B)  # a b c d e f g h
    return tuple(c)

def warp_art(art, size, dst_quad):
    W, H = art.size
    coeffs = solve_perspective(dst_quad, [(0, 0), (W, 0), (W, H), (0, H)])
    return art.transform(size, Image.PERSPECTIVE, coeffs, resample=Image.BICUBIC)

def grain(shape, amount=4.0, seed=7):
    rng = np.random.default_rng(seed)
    n = rng.normal(0, amount, shape[:2])
    return n[..., None]

def composite_print(base, art, dst_quad, ink=MULBERRY, alpha_scale=1.0, blur=0.35, shade=True, seed=7):
    """Print ink onto base with multiply blend, paper texture kept."""
    warped = warp_art(art, base.size, dst_quad)
    if blur:
        warped = warped.filter(ImageFilter.GaussianBlur(blur))
    w = np.asarray(warped).astype(np.float32)
    a = (w[..., 3] / 255.0 * alpha_scale)[..., None]
    rgb = np.asarray(base).astype(np.float32)
    inkc = np.array(ink, np.float32)
    # tint art ink to requested colour, keep alpha
    ink_layer = np.ones_like(rgb) * inkc
    lit = rgb / 255.0
    if shade:
        # let surface light modulate the print a little
        lit = 0.65 + 0.55 * lit
    out = rgb * (1 - a) + (ink_layer * lit) * a
    # paper grain in printed areas
    g = grain(rgb.shape, 3.0, seed) * a
    out = np.clip(out + g, 0, 255)
    return Image.fromarray(out.astype(np.uint8))

def tracked_text(draw, xy, text, font, fill, tracking=0, anchor='mm'):
    # measure with tracking
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x, y = xy
    if anchor[0] == 'm':
        x -= total / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill, anchor='l' + anchor[1])
        x += w + tracking
    return total

# ---------------------------------------------------------------- tag
def make_tag():
    photo = Image.open(f'{SRC}/tag-blank.jpg').convert('RGB')
    quad = [(687, 1035), (908, 1093), (845, 1645), (505, 1660)]

    art = Image.new('RGBA', (900, 1300), (0, 0, 0, 0))
    d = ImageDraw.Draw(art)
    mark = Image.open('/Users/saimyothu/claude-workspace/portfolio-revamp/.tmp-refs/build/mark-mulberry.png')
    mw = 360
    mh = round(mark.height * mw / mark.width)
    mark = mark.resize((mw, mh), Image.LANCZOS)
    art.alpha_composite(mark, ((900 - mw) // 2, 400))

    f_micro = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 30, index=7)
    f_tiny = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 19, index=7)
    ink = MULBERRY + (255,)
    d.rectangle([(300, 795), (600, 797)], fill=MULBERRY + (140,))
    tracked_text(d, (450, 860), 'MADE TO MOVE WITH YOU', f_micro, ink, tracking=7)
    tracked_text(d, (450, 1200), 'PREMIUM WOMENSWEAR', f_tiny, MULBERRY + (210,), tracking=6)

    out = composite_print(photo, art, quad, blur=0.4)
    out.save(f'{OUT}/tag.jpg', quality=92)
    print('tag', out.size)

# ---------------------------------------------------------------- box
def ring_mean(arr, box, pad=14):
    x0, y0, x1, y1 = box
    h, w = arr.shape[:2]
    outer = arr[max(0, y0-pad):min(h, y1+pad), max(0, x0-pad):min(w, x1+pad)]
    mask = np.ones(outer.shape[:2], bool)
    mask[pad:outer.shape[0]-pad, pad:outer.shape[1]-pad] = False
    return outer[mask].mean(axis=0)

def remove_spot(img, box, src_box, feather=10, seed=3):
    im = img.copy()
    patch = img.crop(src_box).resize((box[2]-box[0], box[3]-box[1]), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32)
    p = np.asarray(patch).astype(np.float32)
    # match patch average to the surrounding cardboard
    dest_mean = ring_mean(a, box)
    patch_mean = p.reshape(-1, 3).mean(axis=0)
    p = np.clip(p + (dest_mean - patch_mean), 0, 255)
    patch = Image.fromarray(p.astype(np.uint8))
    mask = Image.new('L', patch.size, 0)
    d = ImageDraw.Draw(mask)
    pad = feather
    d.rectangle([pad, pad, patch.width-pad, patch.height-pad], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather))
    im.paste(patch, (box[0], box[1]), mask)
    return im

def add_foil(img, center, width, seed=11, alpha=0.88):
    mark = Image.open('/Users/saimyothu/claude-workspace/portfolio-revamp/.tmp-refs/build/mark-white.png')
    mh = round(mark.height * width / mark.width)
    mark = mark.resize((width, mh), Image.LANCZOS)
    a = np.asarray(mark)[..., 3].astype(np.float32) / 255.0

    base = np.asarray(img).astype(np.float32)
    H, W = base.shape[:2]
    x0, y0 = int(center[0] - width/2), int(center[1] - mh/2)
    x1, y1 = x0 + width, y0 + mh

    region = base[y0:y1, x0:x1].copy()
    lum = region[..., 0]*0.299 + region[..., 1]*0.587 + region[..., 2]*0.114
    lum = np.clip(lum / 200.0, 0.55, 1.25)
    gold = np.array([236, 211, 183], np.float32)
    # soft embossed foil: fill + highlight above-left + shadow below-right
    filled = gold[None, None, :] * lum[..., None]
    shadow_a = np.roll(a, (2, 1), (0, 1)) * 0.28
    shadow_a[:2, :] = 0; shadow_a[:, :1] = 0
    region = region * (1 - shadow_a[..., None]) + (region * np.array([120, 80, 95], np.float32) / 255.0) * shadow_a[..., None]
    hi_a = np.roll(a, (-1, -1), (0, 1)) * 0.25
    region = region * (1 - hi_a[..., None]) + np.minimum(255, region * 1.35) * hi_a[..., None]
    aa = (a * alpha)[..., None]
    region = region * (1 - aa) + filled * aa
    rng = np.random.default_rng(seed)
    region = region + rng.normal(0, 2.2, (mh, width, 1))
    base[y0:y1, x0:x1] = np.clip(region, 0, 255)
    return Image.fromarray(base.astype(np.uint8))

def make_box():
    im = Image.open(f'{SRC}/box-cardboard.jpg').convert('RGB')
    im = remove_spot(im, (540, 565, 670, 680), (540, 450, 670, 565), feather=12)
    im = remove_spot(im, (795, 480, 935, 592), (795, 350, 935, 462), feather=12)
    # rose grade: keep it dusty, not hot pink
    hsv = np.asarray(im.convert('HSV')).astype(np.int16)
    hsv[..., 0] = (hsv[..., 0] + 220) % 256
    im = Image.fromarray(hsv.astype(np.uint8), 'HSV').convert('RGB')
    im = ImageEnhance.Color(im).enhance(0.46)
    im = ImageEnhance.Brightness(im).enhance(1.12)
    im = add_foil(im, (601, 611), 58, seed=11, alpha=0.72)
    im = add_foil(im, (857, 528), 52, seed=12, alpha=0.72)
    im.save(f'{OUT}/box.jpg', quality=92)
    print('box', im.size)

# ---------------------------------------------------------------- bag
def make_bag():
    im = Image.open(f'{SRC}/bag-paper-marble.jpg').convert('RGB')
    a = np.asarray(im).astype(np.float32)
    hsv_full = np.asarray(im.convert('HSV')).astype(np.int16)
    # kraft paper selection (bag body + handle), not the marble
    sel = (hsv_full[..., 1] > 45) & (hsv_full[..., 0] > 3) & (hsv_full[..., 0] < 60)
    mask = Image.fromarray((sel * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(6))
    # make sure the whole body is covered
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([(525, 285), (1165, 910)], radius=18, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(10))
    m = np.asarray(mask).astype(np.float32)[..., None] / 255.0
    hsv = np.asarray(im.convert('HSV')).astype(np.int16)
    hsv[..., 0] = (hsv[..., 0] + 222) % 256
    graded = np.asarray(Image.fromarray(hsv.astype(np.uint8), 'HSV').convert('RGB')).astype(np.float32)
    graded = np.asarray(ImageEnhance.Color(Image.fromarray(graded.astype(np.uint8))).enhance(0.62)).astype(np.float32)
    graded = np.asarray(ImageEnhance.Brightness(Image.fromarray(graded.astype(np.uint8))).enhance(1.04)).astype(np.float32)
    mix = a * (1 - m) + graded * m
    im = Image.fromarray(np.clip(mix, 0, 255).astype(np.uint8))

    art = Image.new('RGBA', (900, 620), (0, 0, 0, 0))
    mark = Image.open('/Users/saimyothu/claude-workspace/portfolio-revamp/.tmp-refs/build/mark-mulberry.png')
    mw = 300
    mh = round(mark.height * mw / mark.width)
    mark = mark.resize((mw, mh), Image.LANCZOS)
    art.alpha_composite(mark, ((900 - mw)//2, 90))
    d = ImageDraw.Draw(art)
    f = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 27, index=7)
    tracked_text(d, (450, 500), 'MADE TO MOVE WITH YOU', f, MULBERRY + (235,), tracking=7)
    quad = [(672, 390), (1050, 390), (1050, 585), (672, 585)]
    out = composite_print(im, art, quad, blur=0.45, seed=21)
    out.save(f'{OUT}/bag.jpg', quality=92)
    print('bag', out.size)

# ---------------------------------------------------------------- shop
def make_shop():
    im = Image.open(f'{SRC}/jacket-wall.jpg').convert('RGB')
    # 4:5 crop from top, keep rail and clothes
    tgt_w, tgt_h = 1600, 2000
    im = im.resize((tgt_w, round(im.height * tgt_w / im.width)), Image.LANCZOS)
    top = 60
    im = im.crop((0, top, tgt_w, top + tgt_h))
    # gentle warm-neutral grade
    im = ImageEnhance.Color(im).enhance(0.92)
    im = ImageEnhance.Brightness(im).enhance(1.02)
    im.save(f'{OUT}/shop.jpg', quality=92)
    print('shop', im.size)

make_tag()
make_box()
make_bag()
make_shop()
