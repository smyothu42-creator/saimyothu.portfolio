# usage: python3 pos3d/comp.py prefix out.jpg: the render over the orange ground.
import json
import sys
import cv2
import numpy as np
p, out = sys.argv[1:3]
rd = lambda f: cv2.imread(f).astype(np.float32) / 255
A, F, M = rd(p + '-beauty.png'), rd(p + '-floor.png'), rd(p + '-mask.png')[..., :1]
B = rd('pos3d/tex/backdrop-orange.jpg')
Fb = cv2.GaussianBlur(F, (0, 0), 6)
Ab = cv2.GaussianBlur(A, (0, 0), 1.2)
shadow = np.clip(Ab.mean(2, keepdims=True) / np.maximum(Fb.mean(2, keepdims=True), 0.02), 0, 1)
glow = np.clip(Ab - Fb, 0, 1)
# Fade in below the horizon, so the counter's far edge never shows against the sky.
H = A.shape[0]
t = np.clip((np.arange(H, dtype=np.float32) - 0.40 * H) / (0.2 * H), 0, 1)
floor = (t * t * (3 - 2 * t))[:, None, None]
# Shadows keep the ground's warmth (BGR), as on the thumbnail; reflections stay faint.
bg = B * (1 - floor * (1 - shadow) * np.float32([0.75, 0.6, 0.35])) + glow * floor * 0.25
res = bg * (1 - M) + A * M

sys.path.insert(0, 'pos3d')
from screens import paste  # noqa: E402

SKIP_UI = len(sys.argv) > 3 and sys.argv[3] == '--no-ui'  # zoom.py pastes the UI itself
Q = json.load(open(p + '-quads.json'))
SCREENS = (('pos', 'pos3d/tex/pos-screen.png'), ('phone', 'pos3d/tex/phone.png'))
for name, tex in () if SKIP_UI else SCREENS:
    res = paste(res, tex, Q[name], rd(f'{p}-screen-{name}.png')[..., :1])
cv2.imwrite(out, (np.clip(res, 0, 1) * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
