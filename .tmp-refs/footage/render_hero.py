import subprocess, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

W, H = 1600, 900
FPS = 24
DUR = 12.0
N = int(FPS * DUR)
CREAM = (247, 238, 236)

base_mark = Image.open('.tmp-refs/build/mark-white.png').convert('RGBA')
base_mark = base_mark.crop(base_mark.split()[3].getbbox())
m = np.array(base_mark).astype(np.float32)
m[:, :, :3] = CREAM
CREAM_MARK = Image.fromarray(m.astype(np.uint8), 'RGBA')

font = ImageFont.truetype('.tmp-motion/fonts/Jost.ttf', 25)
font.set_variation_by_name('Medium')
WORD = 'WOMENSWEAR'
TRACK = 0.34

# static center warm depth (inverse vignette), subtle
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / 1.414
DEPTH = (0.955 + 0.045 * np.clip(r, 0, 1))[..., None]

def lockup(t):
    """Return (rgba canvas, mark pos, mark size)."""
    breath = 1.0 + 0.006 * math.sin(2 * math.pi * t / DUR)
    mh = int(round(330 * breath))
    mw = int(round(CREAM_MARK.width * mh / CREAM_MARK.height))
    mark = CREAM_MARK.resize((mw, mh), Image.LANCZOS)
    cx = W // 2
    my = 235 + (330 - mh) // 2
    mx = cx - mw // 2
    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sa = Image.new('L', (W, H), 0)
    sa.paste(mark.split()[3], (mx, my + 10))
    sa = sa.filter(ImageFilter.GaussianBlur(16))
    sh = Image.new('RGBA', (W, H), (52, 28, 40, 0))
    sh.putalpha(sa.point(lambda v: int(v * 0.42)))
    canvas.alpha_composite(sh)
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

dec = subprocess.Popen([
    'ffmpeg', '-loglevel', 'error', '-i', '.tmp-refs/footage/hero_loop.mp4',
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'
], stdout=subprocess.PIPE)

enc = subprocess.Popen([
    'ffmpeg', '-loglevel', 'error', '-y',
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
    '-an', '-c:v', 'libx264', '-crf', '21', '-preset', 'slow', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', 'public/case/uz-branding/logo-motion-v5.mp4'
], stdin=subprocess.PIPE)

poster = None
for i in range(N):
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3:
        break
    arr = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
    arr *= DEPTH
    frame = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert('RGBA')
    t = i / FPS
    frame.alpha_composite(lockup(t))
    rgb = frame.convert('RGB')
    if i == 6 * FPS:
        poster = rgb.copy()
    enc.stdin.write(rgb.tobytes())
enc.stdin.close(); enc.wait(); dec.wait()
poster.save('public/case/uz-branding/logo-motion-v5.jpg', quality=90)
print('frames', i + 1)
