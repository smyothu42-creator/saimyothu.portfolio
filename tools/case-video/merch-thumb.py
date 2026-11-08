# usage: python3 merch-thumb.py <out.jpg>
# Merchant Experience's small thumbnail: the real Fund Settlement screen as a flat
# window on dark navy, starting in from the top left and running off the right and
# bottom. (merch-hand.py still makes the card and cover; its thumbnail isn't used.)
import sys, cv2, numpy as np
out = sys.argv[1]
SIZE, SS = 1600, 2
LEFT, TOP = 190, 190     # where the window starts
SHOWN = 0.74             # how much of the screen's width stays in frame
RADIUS = 30
BG_TOP, BG_BOTTOM = (46, 24, 18), (32, 16, 12)  # BGR, dark navy
BORDER = (112, 82, 70)

S = SIZE * SS
ramp = np.linspace(0, 1, S)[:, None, None]
img = (np.float32(BG_TOP) * (1 - ramp) + np.float32(BG_BOTTOM) * ramp) * np.ones((S, S, 3), np.float32)

ui = cv2.imread('out-portal/fund-done-clean.png')[2:, 2:]
x, y, r = LEFT * SS, TOP * SS, RADIUS * SS
w = S - x
scale = w / (ui.shape[1] * SHOWN)
ui = cv2.resize(ui, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)[:S - y, :w]
if ui.shape[0] < S - y:  # a short screen: carry its bottom colour on down
    ui = cv2.copyMakeBorder(ui, 0, S - y - ui.shape[0], 0, 0, cv2.BORDER_REPLICATE)

def shape(grow):
    m = np.zeros((S, S), np.uint8)
    cv2.rectangle(m, (x - grow + r, y - grow), (S, S), 255, -1)
    cv2.rectangle(m, (x - grow, y - grow + r), (S, S), 255, -1)
    cv2.circle(m, (x - grow + r, y - grow + r), r, 255, -1, cv2.LINE_AA)
    return (m / 255.0)[..., None]

# a soft shadow, a thin light border, then the window
shadow = cv2.GaussianBlur(shape(0)[..., 0], (0, 0), 44 * SS)[..., None]
img = img * (1 - shadow * 0.45)
b = shape(2 * SS)
img = img * (1 - b) + np.float32(BORDER) * b
page = np.zeros_like(img); page[y:, x:] = ui
m = shape(0)
img = img * (1 - m) + page * m
img = cv2.resize(img.astype(np.uint8), (SIZE, SIZE), interpolation=cv2.INTER_AREA)
cv2.imwrite(out, img, [cv2.IMWRITE_JPEG_QUALITY, 92])
print(out, img.shape)
