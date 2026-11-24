import subprocess, math, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
import cv2

W, H = 1600, 900
FPS = 24
DUR = 12.0
N = int(FPS * DUR)
CREAM = (247, 238, 236)
OUT_MP4 = 'public/case/uz-branding/logo-motion-v8.mp4'
OUT_JPG = 'public/case/uz-branding/logo-motion-v8.jpg'

# ---- background photographic plate, zoomed slightly to hide warp edges ----
src = Image.open('.tmp-refs/footage/hero_base.jpg').convert('RGB')
z = 1.30
sw, sh = int(W * z), int(H * z)
src = src.resize((sw, sh), Image.LANCZOS)
x0, y0 = (sw - W) // 2, (sh - H) // 2
src = src.crop((x0, y0, x0 + W, y0 + H))
IMG = np.asarray(src).astype(np.float32) / 255.0

yg, xg = np.mgrid[0:H, 0:W].astype(np.float32)

# (amplitude px, spatial cycles across width, temporal cycles per loop, angle deg, phase, trajectory mix)
LAYERS = [
    (110, 0.55, 1, 12, 0.0, 0.18),
    (60, 1.30, 2, -30, 0.40, 0.12),
    (28, 2.80, 3, 65, 0.70, 0.06),
    (12, 0.00, 0, 90, 0.00, 0.00),
]
CAM = 8.0


def shade(warped, Dx, Dy):
    gx = cv2.Sobel(Dx, cv2.CV_32F, 1, 0, ksize=3) / 8.0
    gy = cv2.Sobel(Dy, cv2.CV_32F, 0, 1, ksize=3) / 8.0
    div = cv2.GaussianBlur(gx + gy, (0, 0), 9.0)
    th = np.deg2rad(135.0)
    dirg = cv2.GaussianBlur(gx, (0, 0), 9.0) * np.cos(th) + cv2.GaussianBlur(gy, (0, 0), 9.0) * np.sin(th)
    mult = 1.0 + 1.25 * div + 0.6 * dirg
    mult = np.clip(mult, 0.90, 1.10)
    return np.clip(warped * mult[..., None], 0, 1)


def background(t):
    Dx = np.zeros_like(xg)
    Dy = np.zeros_like(xg)
    for (A, f, m, deg, ph, tr) in LAYERS:
        th = np.deg2rad(deg)
        c, s = np.cos(th), np.sin(th)
        u = (c * xg + s * yg) / W
        w = np.sin(2 * np.pi * (f * u + m * t / DUR + ph))
        Dx += A * w * (-s) + tr * A * w * c
        Dy += A * w * c + tr * A * w * s
    cs = CAM * np.sin(2 * np.pi * t / DUR)
    warped = cv2.remap(IMG, (xg - Dx + cs).astype(np.float32), (yg - Dy).astype(np.float32),
                       cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT_101)
    return shade(warped, Dx, Dy)


# ---- lockup (same as v5) ----
base_mark = Image.open('.tmp-refs/build/mark-white.png').convert('RGBA')
base_mark = base_mark.crop(base_mark.split()[3].getbbox())
mm = np.array(base_mark).astype(np.float32)
mm[:, :, :3] = CREAM
CREAM_MARK = Image.fromarray(mm.astype(np.uint8), 'RGBA')

font = ImageFont.truetype('.tmp-motion/fonts/Jost.ttf', 25)
font.set_variation_by_name('Medium')
WORD = 'WOMENSWEAR'
TRACK = 0.34


def lockup(t):
    breath = 1.0 + 0.006 * math.sin(2 * math.pi * t / DUR)
    mh = int(round(330 * breath))
    mw = int(round(CREAM_MARK.width * mh / CREAM_MARK.height))
    mark = CREAM_MARK.resize((mw, mh), Image.LANCZOS)
    cx = W // 2
    my = 235 + (330 - mh) // 2
    mx = cx - mw // 2
    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    canvas.alpha_composite(mark, (mx, my))
    d = ImageDraw.Draw(canvas)
    ry = my + mh + 52
    d.rectangle([cx - 56, ry, cx + 56, ry + 1], fill=(247, 238, 236, 170))
    widths = [font.getlength(c) for c in WORD]
    tw = sum(widths) + TRACK * 25 * (len(WORD) - 1)
    x = cx - tw / 2
    by = ry + 60
    for c, w in zip(WORD, widths):
        d.text((x, by), c, font=font, fill=(247, 238, 236, 238), anchor='ls')
        x += w + TRACK * 25
    return canvas


def frame(t):
    arr = background(t)
    f = Image.fromarray((arr * 255).astype(np.uint8)).convert('RGBA')
    f.alpha_composite(lockup(t))
    return f.convert('RGB')


if __name__ == '__main__':
    if sys.argv[1:] == ['probe']:
        for tt in [0.0, 1.5, 3.0, 4.5, 6.0, 7.5, 9.0]:
            frame(tt).save(f'.tmp-refs/footage/probe2_{tt:.1f}.jpg', quality=88)
        print('probes done')
    else:
        enc = subprocess.Popen([
            'ffmpeg', '-loglevel', 'error', '-y',
            '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
            '-an', '-c:v', 'libx264', '-crf', '21', '-preset', 'slow', '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart', OUT_MP4,
        ], stdin=subprocess.PIPE)
        poster = None
        for i in range(N):
            rgb = frame(i / FPS)
            if i == 6 * FPS:
                poster = rgb.copy()
            enc.stdin.write(rgb.tobytes())
            if i % 24 == 0:
                print('frame', i, flush=True)
        enc.stdin.close(); enc.wait()
        poster.save(OUT_JPG, quality=90)
        print('done')
