import numpy as np
from PIL import Image
from scipy import ndimage

SRC = '/Users/saimyothu/claude-workspace/portfolio-revamp/public/case/uz-branding/use-18-lookbook-v7.jpg'
a = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float64)
H, W = a.shape[:2]
lum = a.mean(axis=2)

# ---- window of right-hand page used for the light-field fit -------------
wy0, wy1, wx0, wx1 = 700, 1145, 1235, 2012
# rows/cols of the old copy that must not steer the fit
tx0, tx1, ty0, ty1 = 1255, 1945, 940, 1068
mono = (slice(760, 870), slice(1250, 1350))

ys, xs = np.mgrid[wy0:wy1, wx0:wx1]
u = (xs - (wx0 + wx1) / 2.0) / (wx1 - wx0)
v = (ys - (wy0 + wy1) / 2.0) / (wy1 - wy0)

basis = [(u ** pu) * (v ** pv) for pu in range(4) for pv in range(4 - pu)]
B = np.stack([t.ravel() for t in basis], axis=1)

keep = np.ones(lum[wy0:wy1, wx0:wx1].shape, bool)
keep[ty0 - wy0:ty1 - wy0, tx0 - wx0:tx1 - wx0] = False
keep[mono[0].start - wy0:mono[0].stop - wy0, mono[1].start - wx0:mono[1].stop - wx0] = False
l = lum[wy0:wy1, wx0:wx1]
keep &= l > 150
Bk = B[keep.ravel()]

fit = np.zeros((H, W, 3))
for c in range(3):
    ch = a[:, :, c][wy0:wy1, wx0:wx1].ravel()
    coef, *_ = np.linalg.lstsq(Bk, ch[keep.ravel()], rcond=None)
    fit[wy0:wy1, wx0:wx1, c] = (B @ coef).reshape(wy1 - wy0, wx1 - wx0)

l = lum[wy0:wy1, wx0:wx1]
resid = l - fit[wy0:wy1, wx0:wx1].mean(axis=2)
print('fit rms lum', round(float(np.sqrt(np.mean(resid[keep] ** 2))), 2))
for c in range(3):
    r = a[:, :, c][wy0:wy1, wx0:wx1] - fit[wy0:wy1, wx0:wx1, c]
    print(' ch%d rms %.2f  p99.9 %.2f' % (c, np.sqrt(np.mean(r[keep] ** 2)), np.percentile(np.abs(r[keep]), 99.9)))

# ---- ink mask over the old copy ----------------------------------------
sub = lum[ty0:ty1, tx0:tx1]
subfit = fit[ty0:ty1, tx0:tx1].mean(axis=2)
m = (subfit - sub) > 16
m = ndimage.binary_closing(m, np.ones((3, 3), bool))
m = ndimage.binary_dilation(m, ndimage.generate_binary_structure(2, 2), iterations=3)
print('ink px', int(m.sum()))

# ---- grain donor: clean strip above the block --------------------------
dy0, dy1, dx0, dx1 = ty0 - 175, ty0 - 25, tx0, tx1
donor_fit_l = fit[dy0:dy1, dx0:dx1].mean(axis=2)
donor_bad = (donor_fit_l - lum[dy0:dy1, dx0:dx1]) > 10
donor_r = np.stack([a[:, :, c][dy0:dy1, dx0:dx1] - fit[dy0:dy1, dx0:dx1, c] for c in range(3)], axis=2)
donor_r[donor_bad] = 0.0
print('donor rms', round(float(donor_r.std()), 2), 'donor bad px', int(donor_bad.sum()))

gy, gx = m.shape
tile = np.tile(donor_r, (int(np.ceil(gy / donor_r.shape[0])) + 1, int(np.ceil(gx / donor_r.shape[1])) + 1, 1))
grain = tile[31:31 + gy, 77:77 + gx]

recon = np.zeros_like(a)
for c in range(3):
    recon[ty0:ty1, tx0:tx1, c] = fit[ty0:ty1, tx0:tx1, c] + grain[:, :, c]

w = ndimage.gaussian_filter(m.astype(np.float64), 1.6)
w = np.clip(w / max(w.max(), 1e-6), 0, 1)
out = a.copy()
for c in range(3):
    reg = out[ty0:ty1, tx0:tx1, c]
    out[ty0:ty1, tx0:tx1, c] = reg * (1 - w) + recon[ty0:ty1, tx0:tx1, c] * w

clean = np.clip(out, 0, 255).astype(np.uint8)
Image.fromarray(clean).save('/Users/saimyothu/claude-workspace/portfolio-revamp/.tmp-brand/lb9/plate-clean.png')
Image.fromarray(clean).crop((1200, 740, 2060, 1160)).save('/Users/saimyothu/claude-workspace/portfolio-revamp/.tmp-brand/lb9/plate-clean-crop.png')

# sanity: how different is the repair outside ink?
d = np.abs(clean - np.asarray(Image.open(SRC).convert('RGB'))).mean(axis=2)
print('changed px', int((d > 2).sum()), 'max delta', round(float(d.max()), 1))
