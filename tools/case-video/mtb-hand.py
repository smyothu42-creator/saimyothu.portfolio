# MTB Pay Merchant art: the phone-in-hand photo (mtb-hand/source.png) with the real home
# screen (out-mtb/home.png) on it, turned into an iPhone 18: the notch goes, a Dynamic
# Island comes in, and the display grows outward for slimmer bezels.
# usage: python3 mtb-hand.py thumb.jpg card.jpg
import sys
import cv2
import numpy as np

SRC = 'mtb-hand/source.png'
SCREEN = 'out-mtb/home.png'
UP = 3.58       # composite size; the result is reduced by half for clean edges
GROW = 3.2      # source px the display grows on each side (slimmer bezels)
ROUGH = np.array([[483, 143], [727, 170], [650, 673], [405, 640]], np.float64)  # TL TR BR BL


def line(pts):
    vx, vy, x, y = cv2.fitLine(np.float32(pts), cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
    n = np.array([-vy, vx])
    return n, float(n[0] * x + n[1] * y)


def meet(a, b):
    return np.linalg.solve(np.array([a[0], b[0]]), np.array([a[1], b[1]]))


def find_quad(img):
    # The old screen is the only saturated blue area: fit a line to each side of its
    # outline, ignoring the rounded corners, and meet them for sharp corners.
    b, g, r = [img[..., i].astype(np.int32) for i in range(3)]
    m = ((b > r + 40) & (b > 110)).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    # The old artwork's lines cut the blue into pieces, so take the outline of them all.
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    big = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] > 300]
    ys, xs = np.nonzero(np.isin(lab, big))
    c = np.stack([xs, ys], 1).astype(np.int32)[:, None, :]
    hull = cv2.convexHull(c)[:, 0, :].astype(np.float32)
    dense = []
    for i in range(len(hull)):
        a, e = hull[i], hull[(i + 1) % len(hull)]
        dense += [a + (e - a) * t for t in np.linspace(0, 1, 30, endpoint=False)]
    dense = np.array(dense, np.float64)
    print('screen outline', dense.min(0).round(), dense.max(0).round())
    sides = []
    for i in range(4):
        a, e = ROUGH[i], ROUGH[(i + 1) % 4]
        d = (e - a) / np.linalg.norm(e - a)
        rel = dense - a
        t = (rel[:, 0] * d[0] + rel[:, 1] * d[1]) / np.linalg.norm(e - a)
        off = np.abs(rel[:, 1] * d[0] - rel[:, 0] * d[1])
        sides.append(line(dense[(t > 0.2) & (t < 0.8) & (off < 14)]))
    return sides


src = cv2.imread(SRC)
sides = find_quad(src)
centre = ROUGH.mean(0)
grown = []
for n, c in sides:
    if n[0] * centre[0] + n[1] * centre[1] > c:   # point the normal outward
        n, c = -n, -c
    grown.append((n, c + GROW))
quad = np.float32([meet(grown[i - 1], grown[i]) for i in range(4)])  # TL TR BR BL
print('display corners', quad.round(1).tolist())

big = cv2.resize(src, None, fx=UP, fy=UP, interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
BH, BW = big.shape[:2]

scr = cv2.imread(SCREEN).astype(np.float32)
sh, sw = scr.shape[:2]
k = sw / 402
ss = 4  # the island and corners are drawn with smooth edges
isl = np.zeros((sh, sw), np.uint8)
iw, ih, top = 126 * k, 37 * k, 13 * k
x0, x1, y0 = int(sw / 2 - iw / 2), int(sw / 2 + iw / 2), int(top)
r = int(ih / 2)
cv2.rectangle(isl, (x0 + r, y0), (x1 - r, y0 + 2 * r), 255, -1)
cv2.circle(isl, (x0 + r, y0 + r), r, 255, -1, cv2.LINE_AA)
cv2.circle(isl, (x1 - r, y0 + r), r, 255, -1, cv2.LINE_AA)
scr *= 1 - isl[..., None].astype(np.float32) / 255
scr = scr + 0  # island is pure black
lens = (x1 - r, y0 + r)
cv2.circle(scr, lens, int(r * 0.42), (46, 30, 24), -1, cv2.LINE_AA)
disp = np.zeros((sh, sw), np.uint8)
R = int(56 * k)
cv2.rectangle(disp, (R, 0), (sw - R, sh), 255, -1)
cv2.rectangle(disp, (0, R), (sw, sh - R), 255, -1)
for cx in (R, sw - R):
    for cy in (R, sh - R):
        cv2.circle(disp, (cx, cy), R, 255, -1, cv2.LINE_AA)

M = cv2.getPerspectiveTransform(np.float32([[0, 0], [sw, 0], [sw, sh], [0, sh]]), quad * UP)
scr = cv2.GaussianBlur(scr, (0, 0), 0.8)  # the warp shrinks it: avoid shimmer
warp = cv2.warpPerspective(scr, M, (BW, BH), flags=cv2.INTER_LINEAR)
mask = cv2.warpPerspective(disp, M, (BW, BH), flags=cv2.INTER_LINEAR).astype(np.float32) / 255
mask = cv2.GaussianBlur(mask, (0, 0), 0.9)

# Soft window light across the glass, and the same slight warmth as the photo.
yy, xx = np.mgrid[0:BH, 0:BW].astype(np.float32)
u = (xx - yy * 0.45) / UP
sheen = 0.045 * np.exp(-((u - 380) / 70) ** 2)
lit = warp * np.float32([0.93, 0.95, 0.97]) + 255 * sheen[..., None]
out = big * (1 - mask[..., None]) + lit * mask[..., None]
out = cv2.resize(np.clip(out, 0, 255).astype(np.uint8), None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)

s = UP / 2
oh = out.shape[0]
right = out.shape[1]
sq = out[:, right - oh:]   # the right of the photo: leaves out the search-app icon, bottom left
cv2.imwrite(sys.argv[1], cv2.resize(sq, (1600, 1600), interpolation=cv2.INTER_LANCZOS4), [cv2.IMWRITE_JPEG_QUALITY, 90])
cw = int(oh * 1300 / 1200)
cd = out[:, right - cw:]
cv2.imwrite(sys.argv[2], cv2.resize(cd, (1300, 1200), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 90])
