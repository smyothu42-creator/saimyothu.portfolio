# The UI goes on as the real image, not through the render, so its thin lines survive.
import cv2
import numpy as np


def paste(res, tex, quad, vis):
    s = cv2.imread(tex, -1).astype(np.float32) / 255
    if s.shape[2] == 3:
        s = np.dstack([s, np.ones(s.shape[:2], np.float32)])
    s[..., :3] *= s[..., 3:]  # premultiplied, so transparent corners leave no fringe
    q = np.float32(quad) * 2
    w = int(np.linalg.norm(q[1] - q[0]))  # shrink first, so the warp doesn't shimmer
    s = cv2.resize(s, (w, int(w * s.shape[0] / s.shape[1])), interpolation=cv2.INTER_AREA)
    h, w = s.shape[:2]
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), q)
    H, W = res.shape[:2]
    s = cv2.warpPerspective(s, M, (W * 2, H * 2), flags=cv2.INTER_LINEAR)
    s = cv2.resize(s, (W, H), interpolation=cv2.INTER_AREA)
    return res * (1 - s[..., 3:] * vis) + s[..., :3] * vis
