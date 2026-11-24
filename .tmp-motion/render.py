import os, math, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage as ndi

W, H = 1600, 1032
S = 2
CW, CH = W * S, H * S
FPS = 30
DUR = 8.0
N = int(FPS * DUR)
OUT = '.tmp-motion/frames'
os.makedirs(OUT, exist_ok=True)

ROSE = np.array([196, 138, 147], np.float32)
ROSE_LIGHT = np.array([207, 150, 159], np.float32)
ROSE_DARK = np.array([182, 125, 136], np.float32)
INK = np.array([247, 240, 238], np.float32)
CHAMP = np.array([250, 236, 221], np.float32)
SHADOW = np.array([96, 54, 66], np.float32)

# ---------- easing ----------
def smooth(t):
    t = np.clip(t, 0.0, 1.0)
    return t * t * (3 - 2 * t)

def smoother(t):
    t = np.clip(t, 0.0, 1.0)
    return t * t * t * (t * (t * 6 - 15) + 10)

def fade_at(t):
    if t < 0.50 or t > 0.95:
        return 1.0
    return 1.0 - smooth((t - 0.50) / 0.45)

# ---------- background ----------
yy, xx = np.mgrid[0:CH, 0:CW].astype(np.float32)
nx = (xx / CW - 0.5) * 2
ny = (yy / CH - 0.5) * 2
r = np.sqrt(nx ** 2 + (ny * 0.82) ** 2)
lit = np.clip(1.0 - r, 0, 1)[..., None] ** 1.6
bgf = ROSE_DARK + (ROSE_LIGHT - ROSE_DARK) * lit * 0.9
vig = (1.0 - 0.10 * np.clip(r - 0.55, 0, 1) ** 1.4)[..., None]
bgf = bgf * vig
# fine paper grain, fixed to the surface
rng = np.random.default_rng(7)
grain = rng.normal(0, 2.2, (CH, CW)).astype(np.float32)
grain = ndi.gaussian_filter(grain, 0.7)
mottle = rng.normal(0, 2.0, (CH // 24, CW // 24)).astype(np.float32)
mottle = ndi.gaussian_filter(mottle, 2.0)
mottle = np.array(Image.fromarray(mottle).resize((CW, CH), Image.BICUBIC))
grain = grain + mottle * 0.35
BG = np.clip(bgf, 0, 255).astype(np.uint8)

# ---------- mark ----------
mark = Image.open('.tmp-refs/build/mark-white.png').convert('RGBA')
ma = np.array(mark)[:, :, 3]
MM = ma > 128
lab, nlab = ndi.label(MM, structure=np.ones((3, 3)))
# 1 = U, 2 = Z tail, 3 = Z body
U_M = lab == 1
T_M = lab == 2
B_M = lab == 3

def geodesic(mask, seed):
    frontier = np.zeros_like(mask)
    sx, sy = seed
    frontier[sy, sx] = True
    frontier &= mask
    dist = np.full(mask.shape, -1, np.int32)
    unreached = mask.copy()
    d = 0
    while frontier.any():
        dist[frontier] = d
        unreached &= ~frontier
        frontier = ndi.binary_dilation(frontier, structure=np.ones((3, 3), bool)) & unreached
        d += 1
    return dist

dU = geodesic(U_M, (122, 118))
dT = geodesic(T_M, (520, 112))
dB = geodesic(B_M, (412, 374))
nU = dU.astype(np.float32) / dU.max()
nT = dT.astype(np.float32) / dT.max()
nB = dB.astype(np.float32) / dB.max()

bar_r = float(nB[392, 736])
base_l = float(nB[880, 332])
print('body corners', bar_r, base_l)
bar_r = min(max(bar_r, 0.05), 0.9)
base_l = min(max(base_l, bar_r + 0.04), 0.97)

# arrival time (seconds) per pixel
arr = np.full(ma.shape, 99.0, np.float32)
arr[U_M] = 1.10 + 1.75 * smoother(nU[U_M])
arr[T_M] = 2.68 + 0.52 * smooth(nT[T_M])

bnd = np.array([0.0, bar_r, base_l, 1.0], np.float32)
bts = np.array([3.12, 3.58, 3.95, 4.32], np.float32)
nb = nB[B_M]
seg = np.clip(np.searchsorted(bnd, nb, side='right') - 1, 0, 2)
loc = (nb - bnd[seg]) / (bnd[seg + 1] - bnd[seg])
tB = bts[seg] + (bts[seg + 1] - bts[seg]) * smoother(loc)
arr[B_M] = tB
# tiny pause at the corner where tail meets bar
arr[T_M] = np.where(arr[T_M] > 3.20, 3.20 + (arr[T_M] - 3.20) * 0.35, arr[T_M])

# crop mark bbox and scale to display size
bx0, by0, bx1, by1 = 80, 107, 760, 923
mh = 880          # 2x display height
mw = int(round((bx1 - bx0) * mh / (by1 - by0)))
mx = (CW - mw) // 2
my = 400
crop = (bx0, by0, bx1, by1)
alpha_disp = np.array(Image.fromarray((ma[crop[1]:crop[3], crop[0]:crop[2]]).astype(np.uint8))
                       .resize((mw, mh), Image.LANCZOS), np.float32) / 255.0
arr_disp = np.array(Image.fromarray(arr[crop[1]:crop[3], crop[0]:crop[2]], mode='F')
                    .resize((mw, mh), Image.BILINEAR), np.float32)
arr_norm = np.clip(arr_disp, 0, 8) / 8.0
low = rng.normal(0, 1, (mh // 10, mw // 10)).astype(np.float32)
low = np.array(Image.fromarray(low).resize((mw, mh), Image.BICUBIC))
low = ndi.gaussian_filter(low, 6)
low = low / (np.abs(low).max() + 1e-6)
ink_rgb = np.clip(INK[None, None, :] + low[..., None] * 2.0, 0, 255).astype(np.float32)

# sheen coordinate: along Z diagonal (native -> display)
def disp_pt(x, y):
    return ((x - bx0) * mw / (bx1 - bx0), (y - by0) * mh / (by1 - by0))
p0 = disp_pt(742, 386)
p1 = disp_pt(330, 884)
dv = np.array([p1[0] - p0[0], p1[1] - p0[1]], np.float32)
dlen = np.hypot(*dv)
dv /= dlen
gy, gx = np.mgrid[0:mh, 0:mw].astype(np.float32)
proj = ((gx - p0[0]) * dv[0] + (gy - p0[1]) * dv[1]) / dlen

# ---------- tagline ----------
tag = 'MADE TO MOVE WITH YOU'
font = ImageFont.truetype('.tmp-motion/fonts/Jost.ttf', 52)
font.set_variation_by_name('Medium')
fsize = 52
baseline = 1624

# ---------- clear space ----------
cx0, cy0, cx1, cy1 = mx - 220, my - 220, mx + mw + 220, my + mh + 220

# ---------- helpers ----------
def put_region(bg, x0, y0, rgb, a):
    if a.ndim == 3:
        a = a[..., 0]
    h, w = a.shape
    h = min(h, bg.shape[0] - y0); w = min(w, bg.shape[1] - x0)
    sub = bg[y0:y0 + h, x0:x0 + w].astype(np.float32)
    aa = a[:h, :w, None]
    bg[y0:y0 + h, x0:x0 + w] = np.clip(sub * (1 - aa) + rgb[:h, :w] * aa, 0, 255).astype(np.uint8)

def draw_tagline(bg, t):
    if t < 1.0:
        tr_em = 0.30
        intro = True
    else:
        tr_em = 0.18 + 0.12 * smooth((t - 5.35) / 1.10)
        intro = False
    track = tr_em * fsize
    widths = [font.getlength(c) for c in tag]
    total = sum(widths) + track * (len(tag) - 1)
    x = CW / 2 - total / 2
    strip = Image.new('RGBA', (CW, 340), (0, 0, 0, 0))
    d = ImageDraw.Draw(strip)
    base = baseline - 1360
    for i, c in enumerate(tag):
        p = 1.0 if intro else smooth((t - (5.40 + i * 0.042)) / 0.32)
        if p > 0:
            y = base - p * 22
            d.text((x, y), c, font=font, fill=(247, 240, 238, int(255 * p)), anchor='ls')
        x += widths[i] + track
    a = np.array(strip, np.float32)
    a[..., 3] *= fade_at(t)
    put_region(bg, 0, 1360, a[..., :3], a[..., 3:] / 255.0)


def draw_construction(bg, t):
    if t < 6.40 or t > 7.65:
        return
    p = smoother((t - 6.45) / 0.55)
    env = smooth((t - 6.40) / 0.30) * (1 - smooth((t - 7.25) / 0.40))
    if env <= 0:
        return
    ov = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    col = (247, 240, 238, int(46 * env))
    edges = [
        ((cx0, cy0), (cx1, cy0)),
        ((cx1, cy0), (cx1, cy1)),
        ((cx1, cy1), (cx0, cy1)),
        ((cx0, cy1), (cx0, cy0)),
    ]
    per = 4.0
    cur = p * per
    for k, (a, b) in enumerate(edges):
        seg = min(max(cur - k, 0), 1)
        if seg > 0:
            ex = a[0] + (b[0] - a[0]) * seg
            ey = a[1] + (b[1] - a[1]) * seg
            d.line([a, (ex, ey)], fill=col, width=2)
    if p > 0.995:
        tick = int(70 * (1 - smooth((t - 7.25) / 0.40)))
        if tick > 0:
            tc = (247, 240, 238, int(110 * env))
            for (cx, cy, dx, dy) in [(cx0, cy0, 1, 1), (cx1, cy0, -1, 1), (cx1, cy1, -1, -1), (cx0, cy1, 1, -1)]:
                d.line([(cx, cy), (cx + dx * tick, cy)], fill=tc, width=2)
                d.line([(cx, cy), (cx, cy + dy * tick)], fill=tc, width=2)
    a = np.array(ov, np.float32)
    put_region(bg, 0, 0, a[..., :3], a[..., 3:] / 255.0)

def render(t, path):
    bg = BG.copy()
    fade = fade_at(t)
    # ink reveal (the film opens on the finished mark, then breathes out)
    if t < 0.95:
        a = alpha_disp * fade
    else:
        a = alpha_disp * smooth((t - arr_disp) / 0.055) * fade
    if a.max() > 0.001:
        # letterpress shadow
        ash = ndi.gaussian_filter(a, 9.0)
        ash = np.roll(ash, 3, axis=0) * 0.10
        # wet leading edge
        wet = np.exp(-((t - arr_disp) / 0.10) ** 2) * alpha_disp * smooth((t - arr_disp) / 0.055) * 0.12 * fade
        # sheen on the Z diagonal
        sp = (t - 4.62) / 0.85
        if 0 < sp < 1:
            pos = -0.25 + 1.5 * smooth(sp)
            band = np.exp(-((proj - pos * dlen) / 80.0) ** 2)
            sheen = band * alpha_disp * 0.55 * smooth(min(sp, 1) / 0.15) * (1 - smooth((sp - 0.82) / 0.18))
        else:
            sheen = np.zeros_like(a)

        x0, y0 = mx, my
        h, w = mh, mw
        sub = bg[y0:y0 + h, x0:x0 + w].astype(np.float32)
        aa = a[..., None]
        inkc = ink_rgb + wet[..., None] * 10.0
        out = sub * (1 - aa) + inkc * aa
        out = out * (1 - ash[..., None]) + SHADOW[None, None, :] * ash[..., None]
        out = out + sheen[..., None] * (CHAMP[None, None, :] - out) * 0.9
        bg[y0:y0 + h, x0:x0 + w] = np.clip(out, 0, 255).astype(np.uint8)

    draw_tagline(bg, t)
    draw_construction(bg, t)

    f = bg.astype(np.float32) + grain[..., None]
    img = Image.fromarray(np.clip(f, 0, 255).astype(np.uint8)).resize((W, H), Image.LANCZOS)
    img.save(path, compress_level=1)

if __name__ == '__main__':
    which = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if which == 'probe':
        for tt in [0.2, 0.7, 1.5, 2.5, 3.4, 4.1, 4.9, 6.0, 7.0, 7.9]:
            render(tt, f'.tmp-motion/probe_{tt:.1f}.jpg')
        print('probes done')
    else:
        for i in range(N):
            t = i / FPS
            render(t, f'{OUT}/f_{i:04d}.png')
            if i % 20 == 0:
                print('frame', i, flush=True)
        print('done')
