# usage: python3 mock-thumb.py <lp|merch|driver> <out.jpg> [x y width height out-width]
# The More Work thumbnails: Sai's mockup photos (mocks/*.png) with the real screens
# mapped on. The photos are small, so they're enlarged; the screens stay sharp.
# Driver's screen comes from cfg-drv-mock-screen.json (node still.mjs ... mocks/driver-screen.jpg).
import sys, cv2, numpy as np
MOCKS = {
    'lp': dict(src='mocks/hs.png', screen='out-lp-hero/f00000.jpg', crop=(118, 25, 470), neutral=True,  # the photo's purple leaves the laptop; the base is redrawn as crystal below
        crystal=dict(left=[(222, 500), (465, 403), (489, 500)], right=[(465, 403), (705, 423), (705, 500), (489, 500)]),
        quad=[(176, 121.7), (472.7, 40.7), (543.3, 268.3), (241.7, 340.7)], radius=0.03, bottom_round=False,
        keep=[[(302.2, 86), (305.7, 94.2), (335.4, 86.2), (333, 77)]]),
    'merch': dict(src='mocks/merch-hands.png', screen='out-portal/fund-done-clean.png', crop=(110, 22, 520), trim=2, aspect=378.9 / 260.6,
        quad=[(190.1, 115.5), (568.3, 139.4), (552.0, 399.4), (173.6, 375.5)], radius=0.02, bottom_round=True, grow=1.002,  # measured from the photo's edges
        front=[  # traced by hand: the fingers and thumbs in front of the screen
            [(150, 330), (165, 326), (177.5, 315), (181.7, 310), (188, 308), (196.7, 311), (200, 312), (203, 308), (209, 303), (215, 301), (223, 305), (226.7, 311.7), (228, 312), (230, 310), (236.7, 300), (243, 290), (251.7, 280), (258, 272), (262, 269.5), (267, 269.5), (270.5, 272), (272, 277), (272, 284), (270, 292), (267, 300), (262, 310), (255, 320), (248, 330), (244, 340), (240, 350), (236, 360), (233, 370), (231, 380), (230, 392), (230, 425), (150, 425)],
            [(255, 425), (255, 384), (257.5, 381.7), (261, 376.7), (266.7, 372.5), (271, 370.8), (275.8, 370.3), (280, 371), (282.5, 372.5), (285.8, 378.3), (285, 383.3), (285, 425)],
            [(600, 300), (560, 300), (558.75, 321), (553.75, 321.9), (548.75, 325), (545.6, 330), (543.75, 340), (543, 348.75), (545, 358.75), (550, 368.75), (552, 377.5), (553.75, 387.5), (553, 396), (551, 425), (600, 425)],
        ]),
    'driver': dict(src='mocks/driver.png', screen='mocks/driver-screen.jpg', crop=(40, 55, 460),
        quad=[(164.3, 112.1), (304.5, 105.1), (382.5, 404.4), (233.7, 418.7)], radius=0.125, bottom_round=True, grow=1.002,  # measured from the photo's edges
        pill=((221.5, 119), (253.5, 118), 12.5)),
}
name, out = sys.argv[1:3]
m = dict(MOCKS[name])
if len(sys.argv) > 3:  # another framing: x y width height out-width (the cover)
    cx, cy, cw, ch, OUT_W = map(int, sys.argv[3:8]); m['crop'] = (cx, cy, cw, ch)
else:
    OUT_W = 1600
SS = 2
CX, CY, CS, *rest = m['crop']
CH = rest[0] if rest else CS
OUT = OUT_W
OUT_H = round(OUT_W * CH / CS)
src = cv2.imread(m['src'])
if m.get('neutral'):  # blues and purples lose their colour, so the laptop reads as plain silver; their light and shadow stay
    hsv = cv2.cvtColor(src, cv2.COLOR_BGR2HSV).astype(np.float32)
    amount = np.clip((hsv[..., 1] - 3) / 12, 0, 1) * ((hsv[..., 0] > 100) & (hsv[..., 0] < 170))
    amount = cv2.GaussianBlur(amount.astype(np.float32), (0, 0), 0.6)
    new = hsv.copy(); new[..., 1] = hsv[..., 1] * 0.03
    moved = cv2.cvtColor(new.astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32)
    src = (src * (1 - amount[..., None]) + moved * amount[..., None]).astype(np.uint8)
if CY < 0:  # the photo stops short: carry its edge on up
    src = cv2.copyMakeBorder(src, -CY, 0, 0, 0, cv2.BORDER_REPLICATE)
    Y0 = 0
else:
    Y0 = CY
short = Y0 + CH - src.shape[0]
if short > 0:  # the photo stops short: stretch the clean strip at its bottom to fill
    H, W = src.shape[:2]
    strip = 24
    src = np.vstack([src[:H - strip], cv2.resize(src[H - strip:], (W, strip + short), interpolation=cv2.INTER_CUBIC)])
src[470:, :24] = src[460, 30]  # the screenshot's own corner icon
crop = src[Y0:Y0 + CH, CX:CX + CS]
k = OUT / CS
base = cv2.resize(crop, (OUT, OUT_H), interpolation=cv2.INTER_LANCZOS4)
base = cv2.addWeighted(base, 1.3, cv2.GaussianBlur(base, (0, 0), 3), -0.3, 0)

def place(p):
    return ((np.float32(p) - [CX, CY]) * k * SS).astype(np.float32)

if 'crystal' in m:
    # The base as amber crystal: the photo's light mapped onto a bright glass ramp, a
    # little see-through at the far edge, with crisp facet edges and hard highlights.
    # Worked out at full size, so its edges stay sharp however small the photo is.
    def at(p): return ((np.float32(p) - [CX, CY]) * k).astype(np.int32)
    def poly(*ps):
        g = np.zeros((OUT_H * SS, OUT * SS), np.uint8)
        for q in ps: cv2.fillPoly(g, [(at(q) * SS).astype(np.int32)], 255, cv2.LINE_AA)
        return cv2.resize(g, (OUT, OUT_H), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    def strokes(lines, width, blur, power):
        g = np.zeros((OUT_H, OUT), np.float32)
        for u, v in lines: cv2.line(g, tuple(map(int, at(u))), tuple(map(int, at(v))), 1.0, max(1, int(width * k)), cv2.LINE_AA)
        return cv2.GaussianBlur(g, (0, 0), max(0.5, blur * k)) * power
    left, right = m['crystal']['left'], m['crystal']['right']
    shape = poly(left, right)
    gray = cv2.GaussianBlur(cv2.cvtColor(base, cv2.COLOR_BGR2GRAY).astype(np.float32), (0, 0), 0.7 * k)
    inside = gray[shape > 0.9]
    lo, hi = np.percentile(inside, 2), np.percentile(inside, 99.5)
    light = np.clip((gray - lo) / (hi - lo), 0, 1) ** 0.95  # keeps the contrast that makes it read as glass
    stops = np.float32([0, 0.28, 0.6, 0.86, 1])
    ramp = np.float32([[6, 62, 176], [12, 104, 232], [34, 146, 252], [132, 204, 255], [240, 248, 255]])  # BGR
    glass = np.stack([np.interp(light, stops, ramp[:, i]) for i in range(3)], -1).astype(np.float32)
    # each face catches the light differently, so the facets read
    glass *= (poly(left)[..., None] * 1.07 + poly(right)[..., None] * 0.97 + (1 - shape)[..., None])
    # hard glints across the faces
    apex, far, foot, low = (465, 403), (705, 423), (489, 500), (222, 500)
    glint = strokes([((430, 500), (476, 412)), ((300, 500), (420, 424))], 7, 2.2, 0.38) + strokes([((600, 500), (560, 416)), ((640, 500), (612, 420))], 12, 3.5, 0.5)
    glass += (255 - glass) * np.clip(glint, 0, 1)[..., None]
    # bright edges along the top and down the ridge, the way cut glass catches light
    edge = strokes([(apex, far), (apex, low), (apex, foot)], 1.1, 0.25, 1.0) + strokes([(apex, far), (apex, low), (apex, foot)], 3.5, 1.4, 0.42)
    glass += (255 - glass) * np.clip(edge, 0, 1)[..., None]
    # see-through: the backdrop shows a little, most toward the top edges
    yy = np.arange(OUT_H, dtype=np.float32)[:, None]
    top = float(at(apex)[1])
    clear = 0.2 * np.clip(1 - (yy - top) / (45 * k), 0, 1) + 0.03
    backdrop = np.float32(base[int(5 * k), int(5 * k)])
    glass = glass * (1 - clear[..., None]) + backdrop * clear[..., None]
    a_ = shape[..., None]
    base = np.clip(glass * a_ + base.astype(np.float32) * (1 - a_), 0, 255).astype(np.uint8)

quad = np.float32(m['quad'])
c = quad.mean(0)
quad = c + (quad - c) * m.get('grow', 1.012)  # just past the edge, so none of the old screen shows
ui = cv2.imread(m['screen'])
t = m.get('trim', 0)
if t: ui = ui[t:-t, t:-t]
if 'aspect' in m:  # a taller screen than the design: the page carries on down
    extra = round(ui.shape[1] / m['aspect']) - ui.shape[0]
    if extra > 0: ui = cv2.copyMakeBorder(ui, 0, extra, 0, 0, cv2.BORDER_REPLICATE)
h, w = ui.shape[:2]
size = OUT * SS
size_h = OUT_H * SS
M = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), place(quad))
warped = cv2.warpPerspective(ui, M, (size, size_h), flags=cv2.INTER_LINEAR)

flat = np.zeros((h, w), np.uint8)
r = int(m['radius'] * w)
cv2.rectangle(flat, (r, 0), (w - r, h), 255, -1)
cv2.rectangle(flat, (0, r), (w, h if not m['bottom_round'] else h - r), 255, -1)
corners = [(r, r), (w - r, r)] + ([(w - r, h - r), (r, h - r)] if m['bottom_round'] else [])
for cc in corners:
    cv2.circle(flat, cc, r, 255, -1, cv2.LINE_AA)
if m['bottom_round']:
    cv2.rectangle(flat, (r, h - r), (w - r, h), 255, -1)
mask = cv2.warpPerspective(flat, M, (size, size_h), flags=cv2.INTER_LINEAR)
for poly in m.get('keep', []):  # the camera notch stays in front
    cv2.fillPoly(mask, [place(poly).astype(np.int32)], 0, cv2.LINE_AA)
if 'front' in m:
    # Hands stay in front. Well inside the outline, everything is hand; near its edge
    # only warm pixels are, since the photo's old text beside the fingers is neutral black.
    poly = np.zeros((size_h, size), np.uint8)
    for p in m['front']:
        cv2.fillPoly(poly, [place(p).astype(np.int32)], 255, cv2.LINE_AA)
    r_ = int(4 * k * SS)
    core = cv2.erode(poly, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (r_ * 2 + 1, r_ * 2 + 1)))
    big = cv2.resize(crop, (size, size_h), interpolation=cv2.INTER_CUBIC).astype(np.int16)
    warm = np.clip((big[..., 2] - big[..., 0] - 3) * 40, 0, 255).astype(np.uint8)
    front = cv2.max(core, cv2.min(poly, warm))
    front = cv2.GaussianBlur(front, (0, 0), 0.7 * k)
    mask = (mask.astype(np.float32) * (1 - front.astype(np.float32) / 255)).astype(np.uint8)
if 'pill' in m:  # the phone's island stays in front
    a, b, th = m['pill']
    pa, pb = place(a), place(b)
    cv2.line(mask, tuple(map(int, pa)), tuple(map(int, pb)), 0, int(th * k * SS), cv2.LINE_AA)

warped = cv2.resize(warped, (OUT, OUT_H), interpolation=cv2.INTER_AREA)
mask = cv2.resize(mask, (OUT, OUT_H), interpolation=cv2.INTER_AREA)
a = (mask / 255.0)[..., None]
img = (warped * a + base * (1 - a)).astype(np.uint8)
cv2.imwrite(out, img, [cv2.IMWRITE_JPEG_QUALITY, 90])
print(out, img.shape)
