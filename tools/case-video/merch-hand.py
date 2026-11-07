# Merchant Experience art: the tablet-in-hands photo (merch-hand/source.png) with the real
# Fund Settlement screen (out-portal/fund-done-clean.png) on it, seen close. The photo is small, so
# it is scaled up; the screen is pasted at the final size, sharp; thumbs over it stay in front.
# usage: python3 merch-hand.py thumb.jpg card.jpg [cover.jpg]
import sys
import cv2
import numpy as np
sys.path.insert(0, 'pos3d')
from screens import paste  # noqa: E402

SRC, SCREEN = 'merch-hand/source.png', 'out-portal/fund-done-clean.png'
ZOOM_ROOM = 1.12  # view size relative to the screen's extent: lower is closer
GROW = 4.5  # source px each side moves out, so none of the photo's old screen shows at the edges
TRIM = 2    # the screenshot's own border
ROUGH = np.array([(355, 148), (700, 270), (550, 556), (207, 398)], float)  # TL TR BR BL
RATIO = 2388 / 1668  # iPad screen


def screen_quad(img):
    # The screen is the only white / warm-gradient area: fit a line to the middle of each
    # side of its outline (missing the rounded corners and the thumb), and meet them.
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(int)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    m = (((v > 165) & (s < 60)) | ((s > 70) & (v > 150) & ((h < 25) | (h > 160)))).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    comp = (lab == 1 + np.argmax(st[1:, 4])).astype(np.uint8) * 255
    comp = cv2.morphologyEx(comp, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    cnt, _ = cv2.findContours(comp, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    pts = max(cnt, key=cv2.contourArea).reshape(-1, 2).astype(float)
    lines = []
    for i in range(4):
        a, e = ROUGH[i], ROUGH[(i + 1) % 4]
        L = np.linalg.norm(e - a); d = (e - a) / L; rel = pts - a
        t = np.einsum('ij,j->i', rel, d) / L; off = np.abs(rel[:, 1] * d[0] - rel[:, 0] * d[1])
        vx, vy, x, y = cv2.fitLine(np.float32(pts[(t > 0.15) & (t < 0.85) & (off < 14)]), cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
        n_ = np.array([-vy, vx]); lines.append((n_, float(n_ @ [x, y])))
    centre = ROUGH.mean(0)
    lines = [((-n_, -c) if n_ @ centre > c else (n_, c)) for n_, c in lines]  # normals point outward
    lines = [(n_, c + GROW) for n_, c in lines]
    meet = lambda a, b: np.linalg.solve(np.array([a[0], b[0]]), np.array([a[1], b[1]]))
    return np.array([meet(lines[i - 1], lines[i]) for i in range(4)])


def hands(img, quad):
    # In front of the screen: whatever isn't screen and reaches in from outside it (thumbs). The old screen's text and buttons are ringed by screen, so they don't
    # count. Screen is near-white, the red-pink gradient, or its bright orange-yellow top; skin
    # is brown-orange and darker, even where it catches the light.
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(int)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    screen = ((s < 35) & (v > 160)) | (((h < 8) | (h > 165)) & (v > 150)) | ((h >= 8) & (h < 30) & (v >= 195))
    # Not the near-black bezel (the new screen already reaches a little into it), and not thin
    # lines, such as the old screen's anti-aliased rim: only thumbs are left.
    other = cv2.morphologyEx((~screen & (v > 35)).astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    inside = np.zeros(other.shape, np.uint8); cv2.fillPoly(inside, [quad.astype(np.int32)], 1)
    n, lab = cv2.connectedComponents(other)
    keep = np.zeros(other.shape, np.uint8)
    for k in range(1, n):
        c = lab == k
        if (c & (inside == 1)).any() and (c & (inside == 0)).sum() > 30:
            keep[c] = 1  # all of it, not cut at the screen's edge, so the pasted edge can't leak
    return cv2.morphologyEx(keep, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))


src = cv2.imread(SRC)
src = cv2.copyMakeBorder(src[TRIM:-TRIM, TRIM:-TRIM], TRIM, TRIM, TRIM, TRIM, cv2.BORDER_REPLICATE)
quad = screen_quad(src)
occ = hands(src, quad)
cv2.imwrite('merch-hand/occluders.png', occ * 255)
# The screen: the portal at the tablet's width, the page's own background carried on below it,
# with rounded corners.
s = cv2.imread(SCREEN)
sw = 2388; s = cv2.resize(s, (sw, round(sw * s.shape[0] / s.shape[1])), interpolation=cv2.INTER_AREA)
sh = round(sw / RATIO)
s = cv2.copyMakeBorder(s, 0, sh - s.shape[0], 0, 0, cv2.BORDER_REPLICATE)
a = np.zeros((sh, sw), np.uint8); r = int(sw * 0.02)
cv2.rectangle(a, (r, 0), (sw - r, sh), 255, -1); cv2.rectangle(a, (0, r), (sw, sh - r), 255, -1)
for cx in (r, sw - r):
    for cy in (r, sh - r):
        cv2.circle(a, (cx, cy), r, 255, -1, cv2.LINE_AA)
cv2.imwrite('merch-hand/screen.png', np.dstack([s, a]))


def render(cx, cy, fw, fh, W, H):
    # A view of the photo fw x fh source px centred on (cx, cy), scaled to W x H; the screen is
    # pasted at that scale, so it stays sharp however close the view.
    x0, y0 = int(round(cx - fw / 2)), int(round(cy - fh / 2))
    k = W / fw
    crop = lambda im, interp: cv2.resize(im[y0:y0 + fh, x0:x0 + fw], (W, H), interpolation=interp)
    base = crop(src, cv2.INTER_LANCZOS4)
    base = cv2.addWeighted(base, 1.35, cv2.GaussianBlur(base, (0, 0), 1.6), -0.35, 0)  # undo some of the softness
    vis = cv2.GaussianBlur(crop(1 - occ.astype(np.float32), cv2.INTER_LINEAR), (0, 0), 1.2)[..., None]
    q = (quad - [x0, y0]) * k
    res = paste(base.astype(np.float32) / 255, 'merch-hand/screen.png', q, vis)
    # A faint window light across the glass, as in the photo.
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    sheen = 0.03 * np.exp(-(((xx / k + x0) - (yy / k + y0) * 0.5 - 300) / 60) ** 2)
    inside = np.zeros((H, W), np.float32); cv2.fillPoly(inside, [q.astype(np.int32)], 1)
    res = res + sheen[..., None] * inside[..., None] * vis
    return (np.clip(res, 0, 1) * 255).astype(np.uint8)


# Close on the tablet: the frame is the screen's extent plus a little room, so the hands and
# the tablet's edges still show. Thumbnail 1600 square; Work card 1300 x 1200.
lo, hi = quad.min(0), quad.max(0)
cx, cy = (lo + hi) / 2 + [0, 12]
side = int(max(hi - lo) * ZOOM_ROOM)
cv2.imwrite(sys.argv[1], render(cx, cy, side, side, 1600, 1600), [cv2.IMWRITE_JPEG_QUALITY, 92])
cw = int(side * 1300 / 1200)
cv2.imwrite(sys.argv[2], render(cx, cy, cw, side, 1300, 1200), [cv2.IMWRITE_JPEG_QUALITY, 92])
# Case study cover, 1890 x 1400: the page sets its title over the bottom third, so the view
# sits lower on the photo and the screen rides high in the frame.
if len(sys.argv) > 3:
    fh = 600; fw = round(fh * 1890 / 1400)
    top = quad[:, 1].min() - 75  # room above the tablet's top corner
    cy2 = float(np.clip(top + fh / 2, fh / 2, src.shape[0] - fh / 2))
    cv2.imwrite(sys.argv[3], render(cx, cy2, fw, fh, 1890, 1400), [cv2.IMWRITE_JPEG_QUALITY, 92])
print('quad', quad.round(1).tolist(), 'view', side, 'source px')
