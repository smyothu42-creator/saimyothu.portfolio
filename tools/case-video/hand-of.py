# OrderFlow home thumbnail: the hand from the pitch deck's photo (of-hand.png, a
# cut-out) holding an orange iPhone (out-hi-of-home/phone.png, from of-phone.mjs) on
# a smooth gradient in the product's oranges. The photo's old phone is cut away.
# usage: python3 hand-of.py out.jpg
import sys, cv2, numpy as np
N, SCALE, LEFT, TOP = 1600, 1.4, 365, 212
# Old display corners in of-hand.png; the new phone grows out from them to the old
# case's edges, and upward to a true iPhone height.
QUAD = np.float32([[107.5, 50.5], [512.3, 47.5], [508.4, 915.3], [113.6, 912.9]])
GROW_X, GROW_BOTTOM = 52, 47
FIRST_FINGER = 505  # nothing above this row of the photo is hand, only phone

def rgb(h):  # '#rrggbb' to float BGR
    return np.float32([int(h[5:7], 16), int(h[3:5], 16), int(h[1:3], 16)])

def ground():
    # Large soft colour fields only: no lines, no texture. The coordinates are
    # gently bent first, so the blends flow instead of reading as circles.
    y, x = np.mgrid[0:N, 0:N].astype(np.float32) / N
    u = x + 0.09 * np.sin(y * 3.1 + 0.6)
    v = y + 0.07 * np.sin(x * 2.7 + 1.9)
    g = np.broadcast_to(rgb('#f0702b'), (N, N, 3)).copy()
    def glow(cx, cy, rx, ry, colour, strength=1.0):
        nonlocal g
        a = (np.exp(-(((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2)) * strength)[..., None]
        g = g * (1 - a) + rgb(colour) * a
    glow(0.42, 0.50, 0.46, 0.60, '#ec5f22', 0.8)    # the deep centre
    glow(0.02, 0.40, 0.26, 0.40, '#f9bd3c', 0.95)   # yellow, left
    glow(1.02, 0.08, 0.48, 0.50, '#fff0d4')         # cream, top right
    glow(1.06, 0.72, 0.28, 0.40, '#fbb45e', 0.85)   # amber, right
    glow(0.02, 1.04, 0.40, 0.34, '#fddcae', 0.95)   # cream, bottom left
    glow(0.80, 1.06, 0.40, 0.24, '#ec5f22', 0.9)    # deep, bottom right
    # Dither under one level of brightness: invisible, but stops banding in the JPEG.
    return cv2.GaussianBlur(g, (0, 0), 6) + np.random.default_rng(7).normal(0, 0.7, (N, N, 1)).astype(np.float32)

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

p = cv2.imread('out-hi-of-home/phone.png', -1)
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
out = ground() * (1 - shadow[..., None] * np.float32([0.75, 0.6, 0.35]))
out = col * layer[..., None] + out * (1 - layer[..., None])  # the hand
out = wp[..., :3] + out * (1 - pa)            # the phone, in front of the fingertips
cv2.imwrite(sys.argv[1], np.clip(out, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 91])
