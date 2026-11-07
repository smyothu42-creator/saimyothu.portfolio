# The OrderFlow thumbnail's orange ground (ground() in hand-of.py), at the cover's size, or the
# a plain diagonal gradient for another case's cover (green: Superfine employee, sage: SFK driver).
# usage: python3 pos3d/backdrop-orange.py [green|sage out.jpg]
import sys
import cv2
import numpy as np
W, H = 1890, 1400

def rgb(h):
    return np.float32([int(h[5:7], 16), int(h[3:5], 16), int(h[1:3], 16)])

y, x = np.mgrid[0:H, 0:W].astype(np.float32)
y /= H; x /= W
u = x + 0.09 * np.sin(y * 3.1 + 0.6)
v = y + 0.07 * np.sin(x * 2.7 + 1.9)
PALETTES = {  # base, deep, left, top right, right, bottom left
    'orange': ('#f0702b', '#ec5f22', '#f9bd3c', '#fff0d4', '#fbb45e', '#fddcae'),
}
name = sys.argv[1] if len(sys.argv) > 1 else 'orange'
out = sys.argv[2] if len(sys.argv) > 2 else 'pos3d/tex/backdrop-orange.jpg'
LINEAR = {  # dark at the bottom left to light at the top right, nothing else
    'green': [(0, '#0a4840'), (0.45, '#1a6e5c'), (0.8, '#3f9a78'), (1, '#7cc49c')],
    'sage': [(0, '#4f7262'), (0.45, '#7a9a8a'), (0.8, '#a3bdad'), (1, '#d3e0d4')],
}
if name in LINEAR:
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    t = np.clip(0.62 * xx / W + 0.38 * (1 - yy / H), 0, 1)
    stops = LINEAR[name]
    g = np.stack([np.interp(t, [a for a, _ in stops], [rgb(c)[i] for _, c in stops]) for i in range(3)], -1).astype(np.float32)
    g += np.random.default_rng(7).normal(0, 0.7, (H, W, 1)).astype(np.float32)
    cv2.imwrite(out, np.clip(g, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 96])
    sys.exit()
base, deep, left, top, right, foot = PALETTES[name]
g = np.broadcast_to(rgb(base), (H, W, 3)).copy()
for cx, cy, rx, ry, c, k in [
    (0.42, 0.50, 0.46, 0.60, deep, 0.8), (0.02, 0.40, 0.26, 0.40, left, 0.95),
    (1.02, 0.08, 0.48, 0.50, top, 1), (1.06, 0.72, 0.28, 0.40, right, 0.85),
    (0.02, 1.04, 0.40, 0.34, foot, 0.95), (0.80, 1.06, 0.40, 0.24, deep, 0.9)]:
    a = (np.exp(-(((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2)) * k)[..., None]
    g = g * (1 - a) + rgb(c) * a
g = cv2.GaussianBlur(g, (0, 0), 6) + np.random.default_rng(7).normal(0, 0.7, (H, W, 1)).astype(np.float32)
cv2.imwrite(out, np.clip(g, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 96])
