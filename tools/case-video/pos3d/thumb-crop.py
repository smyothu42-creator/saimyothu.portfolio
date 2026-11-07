# usage: python3 pos3d/thumb-crop.py prefix comp.jpg out.jpg: a square cut around the devices.
# The home tile is 1.2:1 and shows the top of the image, so the devices sit high: TOP px down.
import sys
import cv2
import numpy as np
p, comp, out = sys.argv[1:4]
SIDE, TOP = 1290, 100
m = cv2.imread(p + '-mask.png', 0) > 128
ys, xs = np.nonzero(m)
print('devices', xs.min(), xs.max(), ys.min(), ys.max())
i = cv2.imread(comp)
H, W = i.shape[:2]
x = int(np.clip((xs.min() + xs.max()) / 2 - SIDE / 2, 0, W - SIDE))
y = int(np.clip(ys.min() - TOP, 0, H - SIDE))
print('crop', x, y, 'margins', xs.min() - x, x + SIDE - xs.max(), ys.min() - y, y + SIDE - ys.max())
cv2.imwrite(out, i[y:y + SIDE, x:x + SIDE], [cv2.IMWRITE_JPEG_QUALITY, 93])
