# usage: python3 pos3d/zoom.py prefix out.jpg x y w: a closer view without re-rendering. Cuts the
# render's composite (made with comp.py ... --no-ui) at x, y, w wide (height keeps the ratio),
# scales it back to full size, then pastes the real UI at that scale, so the screen stays sharp.
import json
import sys
import cv2
import numpy as np
sys.path.insert(0, 'pos3d')
from screens import paste  # noqa: E402

p, out, x, y, w = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:6])
base = cv2.imread(p + '-noui.jpg').astype(np.float32) / 255
H, W = base.shape[:2]
h = round(w * H / W)
k = W / w
cut = lambda im: cv2.resize(im[y:y + h, x:x + w], (W, H), interpolation=cv2.INTER_LANCZOS4)
res = np.clip(cut(base), 0, 1)
Q = json.load(open(p + '-quads.json'))
for name, tex in (('pos', 'pos3d/tex/pos-screen.png'), ('phone', 'pos3d/tex/phone.png')):
    vis = np.clip(cut(cv2.imread(f'{p}-screen-{name}.png').astype(np.float32) / 255), 0, 1)[..., :1]
    if vis.max() > 0:
        res = paste(res, tex, (np.float32(Q[name]) - [x, y]) * k, vis)
cv2.imwrite(out, (np.clip(res, 0, 1) * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 93])
print('cut', x, y, w, h, 'zoom', round(k, 2))
