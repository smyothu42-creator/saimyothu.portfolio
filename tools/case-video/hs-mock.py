# usage: python3 hs-mock.py <screen image> <out.jpg> [crop x y w h] [out width]
#   thumbnail: python3 hs-mock.py out-hs-project/f00000.jpg thumb.jpg
#   cover:     python3 hs-mock.py out-hs-project/f00000.jpg cover.jpg 0 80 755 559 1890
# Heizen Studio's thumbnail and cover: Sai's laptop-on-a-sofa mockup (hs-mock/source.png)
# with a real screen mapped onto the laptop, keeping its notch and frame.
import sys, cv2, numpy as np
screen_path, out = sys.argv[1:3]
CROP_X, CROP_Y, CROP_W, CROP_H, OUT_W = (*map(int, sys.argv[3:8]),) if len(sys.argv) > 3 else (88, 40, 560, 560, 1600)
OUT_H = round(OUT_W * CROP_H / CROP_W)
SS = 2  # draw the screen and its mask larger, for clean edges
# the screen's corners in the source: tl, tr, br, bl
QUAD = np.float32([[167.3, 126.7], [580.2, 126.7], [579.3, 395.9], [168.9, 395.9]])  # 1px past the edge, so none of the old screen shows
NOTCH = (347.6, 399.7, 135.2)  # left, right, bottom
RADIUS = 6.0  # the screen's top corners

src = cv2.imread('hs-mock/source.png')
crop = src[CROP_Y:CROP_Y + CROP_H, CROP_X:CROP_X + CROP_W]
k = OUT_W / CROP_W
base = cv2.resize(crop, (OUT_W, OUT_H), interpolation=cv2.INTER_LANCZOS4)
blur = cv2.GaussianBlur(base, (0, 0), 3)
base = cv2.addWeighted(base, 1.35, blur, -0.35, 0)  # the source is small: sharpen a touch

def place(p):
    return ((np.float32(p) - [CROP_X, CROP_Y]) * k * SS).astype(np.float32)

# the screen image, trimmed to the laptop screen's shape
ui = cv2.imread(screen_path)
h, w = ui.shape[:2]
aspect = np.linalg.norm(QUAD[1] - QUAD[0]) / np.linalg.norm(QUAD[3] - QUAD[0])
tw = int(h * aspect)
x = (w - tw) // 2
ui = ui[:, x:x + tw]
h, w = ui.shape[:2]
M = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), place(QUAD))
warped = cv2.warpPerspective(ui, M, (OUT_W * SS, OUT_H * SS), flags=cv2.INTER_LINEAR, borderValue=(12, 12, 12))

# mask: the screen, minus the notch, with rounded top corners
mask = np.zeros((OUT_H * SS, OUT_W * SS), np.uint8)
cv2.fillConvexPoly(mask, place(QUAD).astype(np.int32), 255)
r = RADIUS * k * SS
for corner, sign in ((QUAD[0], 1), (QUAD[1], -1)):
    c = place(corner)
    cx, cy = int(c[0] + sign * r), int(c[1] + r)
    x0, x1 = sorted((int(c[0]), cx))
    mask[int(c[1]):cy, x0:x1 + 1] = 0
    cv2.circle(mask, (cx, cy), int(r), 255, -1, cv2.LINE_AA)
nl, nr = place([NOTCH[0], 0])[0], place([NOTCH[1], 0])[0]
ntop = place(QUAD[0])[1]
nb = place([0, NOTCH[2]])[1]
mask[int(ntop) - 2:int(nb), int(nl):int(nr)] = 0

warped = cv2.resize(warped, (OUT_W, OUT_H), interpolation=cv2.INTER_AREA)
mask = cv2.resize(mask, (OUT_W, OUT_H), interpolation=cv2.INTER_AREA)
a = (mask / 255.0)[..., None]
img = (warped * a + base * (1 - a)).astype(np.uint8)
cv2.imwrite(out, img, [cv2.IMWRITE_JPEG_QUALITY, 90])
print(out, img.shape)
