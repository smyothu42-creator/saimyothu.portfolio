# usage: python3 merch-flat.py <out.jpg> [background hex]
# Merchant Experience's small thumbnail: Sai's flat tablet-and-pen mockup
# (mocks/merch-flat.png) with the real Fund Settlement screen, on a background
# in the portal's own colours. The mockup's shadows are kept, tinted to match.
import sys, cv2, numpy as np
out = sys.argv[1]
hexc = (sys.argv[2] if len(sys.argv) > 2 else 'FDEBEB').lstrip('#')
BG = np.float32([int(hexc[i:i + 2], 16) for i in (4, 2, 0)])  # BGR
OUT, SS = 1600, 2
SCREEN = (87.4, 104.5, 604.5, 449.4)    # measured from the mockup
DEVICE = (71.3, 88.6, 620.6, 465.2)     # the tablet with its light rim
DEVICE_R = 21
PEN = [(658, 146), (661, 140.5), (672, 140.5), (677, 146), (677, 388), (668.5, 412), (658, 388)]
SPAN = (72, 680, 90, 465)               # tablet and pen together, to centre
WIDTH = 0.82                            # how much of the frame they fill
PAPER = 250.0                           # the mockup's background

k = OUT * WIDTH / (SPAN[1] - SPAN[0])
ox = OUT / 2 - k * (SPAN[0] + SPAN[1]) / 2
oy = OUT / 2 - k * (SPAN[2] + SPAN[3]) / 2
src = cv2.imread('mocks/merch-flat.png')
src[495:] = PAPER  # the screenshot's own corner icon
A = np.float32([[k, 0, ox], [0, k, oy]])
base = cv2.warpAffine(src, A, (OUT, OUT), flags=cv2.INTER_LANCZOS4, borderValue=(PAPER,) * 3).astype(np.float32)
base = cv2.addWeighted(base, 1.2, cv2.GaussianBlur(base, (0, 0), 2.5), -0.2, 0)
P = lambda x, y: (int(round((x * k + ox) * SS)), int(round((y * k + oy) * SS)))
S = OUT * SS

def rounded(x0, y0, x1, y1, r):
    m = np.zeros((S, S), np.uint8)
    (a, b), (c, d) = P(x0, y0), P(x1, y1)
    r = int(r * k * SS)
    cv2.rectangle(m, (a + r, b), (c - r, d), 255, -1)
    cv2.rectangle(m, (a, b + r), (c, d - r), 255, -1)
    for cc in ((a + r, b + r), (c - r, b + r), (c - r, d - r), (a + r, d - r)):
        cv2.circle(m, cc, r, 255, -1, cv2.LINE_AA)
    return m

small = lambda m: (cv2.resize(m, (OUT, OUT), interpolation=cv2.INTER_AREA) / 255.0)[..., None].astype(np.float32)

# the background takes the colour; the tablet and pen keep theirs
keep = rounded(*DEVICE, DEVICE_R)
cv2.fillPoly(keep, [np.int32([P(x, y) for x, y in PEN])], 255, cv2.LINE_AA)
a = small(keep)
tinted = np.clip(base / PAPER, 0, 1) * BG
img = base * a + tinted * (1 - a)

# the real screen, in its true proportions; the page carries on down
ui = cv2.imread('out-portal/fund-done-clean.png')[2:-2, 2:-2]
sw, sh = SCREEN[2] - SCREEN[0], SCREEN[3] - SCREEN[1]
extra = round(ui.shape[1] * sh / sw) - ui.shape[0]
if extra > 0: ui = cv2.copyMakeBorder(ui, 0, extra, 0, 0, cv2.BORDER_REPLICATE)
(x0, y0), (x1, y1) = P(SCREEN[0], SCREEN[1]), P(SCREEN[2], SCREEN[3])
page = np.zeros((S, S, 3), np.float32)
page[y0:y1, x0:x1] = cv2.resize(ui, (x1 - x0, y1 - y0), interpolation=cv2.INTER_AREA)
page = cv2.resize(page, (OUT, OUT), interpolation=cv2.INTER_AREA)
sm = small(rounded(*SCREEN, 8))
img = img * (1 - sm) + page * sm
cv2.imwrite(out, np.clip(img, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
print(out)
