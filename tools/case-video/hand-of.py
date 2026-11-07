# OrderFlow home thumbnail: the hand from the pitch deck's photo (of-hand.png, a
# cut-out) holding an orange iPhone (out-hi-of-home/phone.png, from of-phone.mjs) on
# a smooth gradient in the product's oranges. The photo's old phone is cut away.
# usage: python3 hand-of.py out.jpg [mtb]   (mtb: MTB Pay Merchant's phone on red aurora light)
import sys, cv2, numpy as np
N, SCALE, LEFT, TOP = 1600, 1.4, 365, 212
# Old display corners in of-hand.png; the new phone grows out from them to the old
# case's edges, and upward to a true iPhone height.
QUAD = np.float32([[107.5, 50.5], [512.3, 47.5], [508.4, 915.3], [113.6, 912.9]])
GROW_X, GROW_BOTTOM = 52, 47
FIRST_FINGER = 505  # nothing above this row of the photo is hand, only phone
LOOKS = {
    'of': dict(ground='orange', phone='out-hi-of-home/phone.png', shadow=[0.75, 0.6, 0.35],
               base='#f0702b', deep='#ec5f22', left='#f9bd3c', top='#fff0d4', right='#fbb45e', foot='#fddcae'),
    'mtb': dict(ground='aurora', phone='out-mtb/phone.png', shadow=[0.7, 0.7, 0.35]),
}
L = LOOKS[sys.argv[2] if len(sys.argv) > 2 else 'of']

def rgb(h):  # '#rrggbb' to float BGR
    return np.float32([int(h[5:7], 16), int(h[3:5], 16), int(h[1:3], 16)])

def ground():
    # Large soft colour fields only: no lines, no texture. The coordinates are
    # gently bent first, so the blends flow instead of reading as circles.
    y, x = np.mgrid[0:N, 0:N].astype(np.float32) / N
    u = x + 0.09 * np.sin(y * 3.1 + 0.6)
    v = y + 0.07 * np.sin(x * 2.7 + 1.9)
    g = np.broadcast_to(rgb(L['base']), (N, N, 3)).copy()
    def glow(cx, cy, rx, ry, colour, strength=1.0):
        nonlocal g
        a = (np.exp(-(((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2)) * strength)[..., None]
        g = g * (1 - a) + rgb(colour) * a
    glow(0.42, 0.50, 0.46, 0.60, L['deep'], 0.8)    # the deep centre
    glow(0.02, 0.40, 0.26, 0.40, L['left'], 0.95)   # bright, left
    glow(1.02, 0.08, 0.48, 0.50, L['top'])          # pale, top right
    glow(1.06, 0.72, 0.28, 0.40, L['right'], 0.85)  # soft, right
    glow(0.02, 1.04, 0.40, 0.34, L['foot'], 0.95)   # pale, bottom left
    glow(0.80, 1.06, 0.40, 0.24, L['deep'], 0.9)    # deep, bottom right
    # Dither under one level of brightness: invisible, but stops banding in the JPEG.
    return cv2.GaussianBlur(g, (0, 0), 6) + np.random.default_rng(7).normal(0, 0.7, (N, N, 1)).astype(np.float32)

def ramp(t, stops):
    # Colour by brightness: `stops` are (position, '#rrggbb').
    xs = [a for a, _ in stops]
    return np.stack([np.interp(t, xs, [rgb(c)[i] for _, c in stops]) for i in range(3)], -1).astype(np.float32)

def finish(g):
    return cv2.GaussianBlur(g, (0, 0), 3) + np.random.default_rng(7).normal(0, 0.9, (N, N, 1)).astype(np.float32)

RED = [(0, '#14020a'), (0.22, '#3d0610'), (0.45, '#8c0d18'), (0.65, '#d4141f'), (0.82, '#fb4a3f'), (0.94, '#ff9a7a'), (1, '#ffe2cc')]

def aurora():
    # Soft sweeps of red light over a deep wine ground, brightest behind the phone: kept
    # gentle (low contrast, wide soft edges) so the phone stays the focus.
    y, x = np.mgrid[0:N, 0:N].astype(np.float32) / N
    t = 0.30 + 0.26 * np.exp(-(((x - 0.5) / 0.6) ** 2 + ((y - 0.45) / 0.65) ** 2))
    for a, b, c, d, wd, k in [(0.16, 0.15, 2.9, 0.4, 0.34, 0.16), (0.50, 0.18, 2.2, 2.1, 0.3, 0.14), (0.88, 0.12, 3.4, 4.0, 0.26, 0.12)]:
        e = y - (a + b * np.sin(c * x + d) + 0.45 * (0.5 - x))
        t += k * np.where(e < 0, np.exp(-(e / 0.11) ** 2), np.exp(-e / wd))
    return finish(ramp(np.clip(t, 0, 0.72), RED))

src = cv2.imread('of-hand.png', -1)
hsv = cv2.cvtColor(src[..., :3], cv2.COLOR_BGR2HSV)
g = cv2.cvtColor(src[..., :3], cv2.COLOR_BGR2GRAY)
solid = src[..., 3] > 40
case = (hsv[..., 0] < 20) & (hsv[..., 1] > 175) & solid
dark = (g < 45) & solid
old = np.zeros(g.shape, np.uint8)
old[case | dark] = 255
old[int(QUAD[0, 1]):int(QUAD[2, 1]), int(QUAD[0, 0]):int(QUAD[1, 0])] = 255  # the display
old = cv2.morphologyEx(old, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
_, lab, st, _ = cv2.connectedComponentsWithStats(old)
old = (lab == 1 + np.argmax(st[1:, 4])).astype(np.uint8) * 255
old = cv2.dilate(old, np.ones((5, 5), np.uint8))

hand = src.astype(np.float32).copy()
hand[..., 3] *= 1 - cv2.GaussianBlur(old, (0, 0), 1).astype(np.float32) / 255
hand[:FIRST_FINGER, :, 3] = 0
# Pull the cut-out in a little: its outer edge carries a pale fringe from the photo.
hand[..., 3] = cv2.GaussianBlur(cv2.erode(hand[..., 3], np.ones((5, 5), np.uint8)), (0, 0), 0.9)
hand = np.clip(cv2.resize(hand, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_LANCZOS4), 0, 255)

p = cv2.imread(L['phone'], -1)
ph, pw = p.shape[:2]
tl, tr, br, bl = QUAD
bl2 = bl + [-GROW_X, GROW_BOTTOM]; br2 = br + [GROW_X, GROW_BOTTOM]
width = np.linalg.norm(br2 - bl2); height = width * ph / pw
lean_l = (tl - bl) / np.linalg.norm(tl - bl); lean_r = (tr - br) / np.linalg.norm(tr - br)
tl2 = bl2 + lean_l * height; tr2 = br2 + lean_r * height
dst = (np.array([tl2, tr2, br2, bl2]) * SCALE + [LEFT, TOP]).astype(np.float32)
M = cv2.getPerspectiveTransform(np.float32([[0, 0], [pw, 0], [pw, ph], [0, ph]]), dst)
# Premultiplied, so the transparent corners don't leave a dark fringe.
pm = p.astype(np.float32); pm[..., :3] *= pm[..., 3:] / 255
wp = cv2.warpPerspective(pm, M, (N, N), flags=cv2.INTER_AREA)

layer = np.zeros((N, N), np.float32); col = np.zeros((N, N, 3), np.float32)
H, W = hand.shape[:2]
h, w = min(H, N - TOP), min(W, N - LEFT)
layer[TOP:TOP + h, LEFT:LEFT + w] = hand[:h, :w, 3] / 255; col[TOP:TOP + h, LEFT:LEFT + w] = hand[:h, :w, :3]

pa = wp[..., 3:] / 255
both = np.maximum(layer, pa[..., 0])
shift = np.zeros_like(both); shift[44:, 36:] = both[:-44, :-36]
shadow = cv2.GaussianBlur(shift, (0, 0), 52, borderType=cv2.BORDER_REPLICATE) * 0.24
out = (aurora if L['ground'] == 'aurora' else ground)() * (1 - shadow[..., None] * np.float32(L['shadow']))
out = col * layer[..., None] + out * (1 - layer[..., None])  # the hand
out = wp[..., :3] + out * (1 - pa)            # the phone, in front of the fingertips
cv2.imwrite(sys.argv[1], np.clip(out, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 91])
