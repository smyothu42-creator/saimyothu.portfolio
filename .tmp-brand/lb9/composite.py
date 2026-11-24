import numpy as np
from PIL import Image, ImageFilter

BASE = '/Users/saimyothu/claude-workspace/portfolio-revamp/.tmp-brand/lb9/'
plate = np.asarray(Image.open(BASE + 'plate-clean.png').convert('RGB')).astype(np.float64)
lay = np.asarray(Image.open(BASE + 'layer.png').convert('RGBA')).astype(np.float64)

a = lay[..., 3] / 255.0
a = np.asarray(Image.fromarray(np.uint8(a * 255)).filter(ImageFilter.GaussianBlur(0.85))).astype(np.float64) / 255.0

INK = np.array([56.4, 43.8, 45.2])
PAPER = np.array([233.2, 223.2, 221.2])
R = INK / PAPER
DENSITY = 0.94

w = (a * DENSITY)[..., None]
out = plate * (1.0 - w) + plate * (R[None, None, :]) * w

# faint ink-fibre mottling so strokes are not perfectly uniform
rng = np.random.default_rng(7)
nz = np.asarray(Image.fromarray(np.uint8(rng.normal(128, 9, (338, 672))).clip(0, 255)).resize((2400, 1350), Image.BILINEAR)).astype(np.float64) / 128.0 - 1.0
out = out * (1.0 + 0.045 * nz[..., None] * w)

out = np.clip(out, 0, 255).astype(np.uint8)
Image.fromarray(out).save(BASE + 'composite-preview.png')
Image.fromarray(out).crop((1180, 700, 2100, 1250)).save(BASE + 'composite-crop.png')
Image.fromarray(out).crop((1240, 860, 2020, 1140)).resize((1560, 560), Image.LANCZOS).save(BASE + 'composite-zoom.png')
print('ok')
