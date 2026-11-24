from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

BASE = '/Users/saimyothu/vibe_images/uz-lookbook-blank-base-v2_1795110006034_66704596.png'
OUT = '/Users/saimyothu/claude-workspace/portfolio-revamp/public/case/uz-branding/type-book.jpg'
F_ITALIC = '/Users/saimyothu/claude-workspace/uz-brand/UZ Brand Kit/03 Fonts/Cormorant Garamond (headlines)/CormorantGaramond-MediumItalic.ttf'
F_JOST = '/Users/saimyothu/claude-workspace/uz-brand/UZ Brand Kit/03 Fonts/Jost (body and labels)/Jost-Regular.ttf'
INK = np.array([63, 34, 49], dtype=np.float32)

# page quads measured on the 1792x1024 base (TL, TR, BR, BL)
LEFT = [(258, 72), (884, 62), (888, 912), (246, 918)]
RIGHT = [(884, 62), (1490, 70), (1502, 928), (888, 912)]


def quad_pt(q, u, v):
    p00, p10, p11, p01 = q
    return (
        (1 - u) * (1 - v) * p00[0] + u * (1 - v) * p10[0] + u * v * p11[0] + (1 - u) * v * p01[0],
        (1 - u) * (1 - v) * p00[1] + u * (1 - v) * p10[1] + u * v * p11[1] + (1 - u) * v * p01[1],
    )


def find_coeffs(pa, pb):
    m = []
    for (x, y), (X, Y) in zip(pa, pb):
        m.append([x, y, 1, 0, 0, 0, -X * x, -X * y])
        m.append([0, 0, 0, x, y, 1, -Y * x, -Y * y])
    A = np.array(m, dtype=np.float64)
    B = np.array([c for p in pb for c in p], dtype=np.float64)
    res = np.linalg.solve(A, B)
    return res.tolist()


def draw_tracked(d, xy, text, font, tracking):
    x, y = xy
    for ch in text:
        w = d.textlength(ch, font=font)
        d.text((x, y), ch, font=font, fill=255)
        x += w + tracking
    return x


def tracked_width(d, text, font, tracking):
    return sum(d.textlength(c, font=font) for c in text) + tracking * (len(text) - 1)


def make_text(canvas_w, canvas_h, kind):
    img = Image.new('L', (canvas_w, canvas_h), 0)
    d = ImageDraw.Draw(img)
    cx = canvas_w / 2

    label_font = ImageFont.truetype(F_JOST, int(canvas_w * 0.030))
    cap_font = ImageFont.truetype(F_JOST, int(canvas_w * 0.030))
    folio_font = ImageFont.truetype(F_JOST, int(canvas_w * 0.026))

    if kind == 'left':
        label = 'HEADLINES'
        caption = 'Cormorant Garamond, italic'
        aa = ImageFont.truetype(F_ITALIC, int(canvas_w * 0.62))
        folio = '01'
        tracking = canvas_w * 0.012
        # specimen baseline
        ax, ay = cx, canvas_h * 0.60
    else:
        label = 'BODY AND LABELS'
        caption = 'Jost, regular'
        aa = ImageFont.truetype(F_JOST, int(canvas_w * 0.53))
        folio = '02'
        tracking = canvas_w * 0.012
        ax, ay = cx, canvas_h * 0.58

    # top label, letterspaced, centred
    tw = tracked_width(d, label, label_font, tracking)
    draw_tracked(d, (cx - tw / 2, canvas_h * 0.215), label, label_font, tracking)

    # short rule under the label
    d.line([(cx - canvas_w * 0.05, canvas_h * 0.265), (cx + canvas_w * 0.05, canvas_h * 0.265)], fill=255, width=2)

    # big specimen, centred on its bounding box
    bbox = d.textbbox((0, 0), 'Aa', font=aa, anchor='ls')
    aw = bbox[2] - bbox[0]
    d.text((ax - aw / 2 - bbox[0], ay), 'Aa', font=aa, fill=255, anchor='ls')

    # caption under the specimen
    cw = d.textlength(caption, font=cap_font)
    d.text((cx - cw / 2, canvas_h * 0.775), caption, font=cap_font, fill=255)

    # folio
    fw = d.textlength(folio, font=folio_font)
    fxo = canvas_w * 0.11 if kind == 'left' else canvas_w * 0.89 - fw
    d.text((fxo, canvas_h * 0.90), folio, font=folio_font, fill=255)

    return img


def warp(draw_region, image):
    """Render text canvas onto the base image region with a homography."""
    (x0, y0, x1, y1) = draw_region
    w, h = int(round(x1 - x0)), int(round(y1 - y0))
    return (x0, y0, w, h)


def apply_page(base, page_quad, u0, u1, v0, v1, canvas_w, kind):
    # page-space rectangle -> image quad
    q = [quad_pt(page_quad, u0, v0), quad_pt(page_quad, u1, v0), quad_pt(page_quad, u1, v1), quad_pt(page_quad, u0, v1)]
    xs = [p[0] for p in q]; ys = [p[1] for p in q]
    x0, y0 = int(np.floor(min(xs))) - 2, int(np.floor(min(ys))) - 2
    x1, y1 = int(np.ceil(max(xs))) + 2, int(np.ceil(max(ys))) + 2
    W, H = x1 - x0, y1 - y0
    aspect = (np.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1])) / np.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1])
    canvas_h = int(round(canvas_w / aspect))
    text = make_text(canvas_w, canvas_h, kind)

    targets = [(qx - x0, qy - y0) for qx, qy in q]
    sources = [(0, 0), (canvas_w, 0), (canvas_w, canvas_h), (0, canvas_h)]
    coeffs = find_coeffs(targets, sources)
    warped = text.transform((W, H), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    warped = warped.filter(ImageFilter.GaussianBlur(0.6))

    alpha = np.asarray(warped).astype(np.float32) / 255.0

    # uneven print density + film grain
    rng = np.random.default_rng(11)
    low = rng.normal(0, 1, (H // 24 + 2, W // 24 + 2)).astype(np.float32)
    low = np.asarray(Image.fromarray(((low - low.min()) / (np.ptp(low) + 1e-6) * 255).astype(np.uint8))
                     .resize((W, H), Image.BICUBIC)).astype(np.float32) / 255.0
    grain = rng.normal(0, 1, (H, W)).astype(np.float32)
    density = (0.90 + 0.10 * low) * (1.0 + 0.035 * grain)
    alpha = np.clip(alpha * density, 0, 1)

    region = np.asarray(base.crop((x0, y0, x1, y1))).astype(np.float32)
    a = alpha[..., None]
    mixed = region * (1 - a + a * INK / 255.0)
    base.paste(Image.fromarray(np.clip(mixed, 0, 255).astype(np.uint8)), (x0, y0))


def main():
    base = Image.open(BASE).convert('RGB')
    apply_page(base, LEFT, 0.16, 0.80, 0.10, 0.94, 1000, 'left')
    apply_page(base, RIGHT, 0.20, 0.84, 0.10, 0.94, 1000, 'right')

    # very light paper grain over everything to bind print to the photo
    arr = np.asarray(base).astype(np.float32)
    rng = np.random.default_rng(5)
    arr += rng.normal(0, 1.6, arr.shape[:2])[..., None]
    base = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    base.save(OUT, quality=93, subsampling=1)
    print('saved', OUT, base.size)


main()
