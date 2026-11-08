# Merchant Experience flows, from the real Figma boards (Merchant Portal.zip, rendered into
# out-portal-raw/): frame folders out-portal-<name>/ with click positions for compose.mjs
# (cfg-portal-<name>.json, cursor on). Each screen holds, the cursor clicks, the next one fades in.
import json, os, cv2, numpy as np
K = 2000 / 1440
HOLD, AFTER, FADE, STEPS, END = 1.15, 0.12, 0.3, 8, 1.6
# each step: screen, clicks on it (in 1440 x 900 page pixels)
FLOWS = {
  'login': [('login-00', [(720, 563)]), ('login-01', [(720, 716)]), ('login-02', [(912, 644)]), ('login-03', [(720, 772)]), ('login-04', [])],
  'dash': [('dash-00', [(851, 828)]), ('dash-01', [(488, 626)]), ('dash-02', [(603, 626)]), ('dash-03', [])],
  'tx': [('tx-00', [(1152, 228)]), ('tx-01', [])],
  'refund': [('refund-00', [(675, 390)]), ('refund-01', [(460, 457)]), ('refund-02', [(1322, 288)]), ('refund-03', [(923, 714)]), ('refund-04', [])],
  'fund': [('fund-00', [(112, 315)]), ('fund-01', [(980, 475)]), ('fund-02', [(1250, 660)]), ('fund-03', [(698, 529)]), ('fund-04', [(882, 612)]), ('fund-05', [])],
  'api': [('api-00', [(1290, 144)]), ('api-01', [(837, 630)]), ('api-02', [])],
}
PAN = {'tx-00': 2.6}  # this table is wider than the page: scroll across it first
WIDTHS = {'fund-00': 1440, 'fund-01': 1376, 'fund-02': 1388, 'fund-03': 1428, 'fund-04': 1380, 'fund-05': 1372}
# Figma's prototype lines and dots: fill from just beside them. (axis, x0, y0, x1, y1)
CLEAN = {
  'fund-00': [('row', 225, 305, 1440, 325)],
  'fund-02': [('col', 947, 570, 968, 900), ('col', 1238, 678, 1262, 900)],
  'fund-03': [('row', 975, 490, 1150, 512), ('col', 1133, 495, 1152, 900)],
  'fund-04': [('row', 958, 492, 985, 514)],
  'refund-01': [('col', 450, 468, 474, 532), ('row', 450, 518, 1440, 542)],
  'refund-02': [('row', 1195, 225, 1440, 246), ('col', 1195, 230, 1215, 292), ('col', 1215, 278, 1244, 296)],
  'refund-03': [('row', 1000, 596, 1020, 620)],
  'login-00': [('col', 1424, 495, 1440, 525)], 'login-01': [('col', 1424, 495, 1440, 525)], 'login-02': [('col', 1424, 495, 1440, 525)],
  'login-03': [('col', 10, 44, 30, 68)],
  'api-01': [('row', 990, 500, 1440, 522), ('col', 1400, 350, 1440, 660)],
  'tx-00': [('row', 4560 + 1120, 140, 4560 + 1440, 202)],
}
# The design's own hover arrows on the charts, which would sit beside the moving cursor
ARROWS = {'fund-00': (1256, 991, 1282, 1017), 'dash-01': (1256, 1119, 1283, 1145), 'dash-03': (1266, 1226, 1293, 1252)}
def load(n):
    im = cv2.imread(f'out-portal-raw/{n}.png')
    if n in ARROWS:
        x0, y0, x1, y1 = ARROWS[n]
        m = np.zeros(im.shape[:2], np.uint8)
        m[y0:y1, x0:x1] = (im[y0:y1, x0:x1].max(axis=2) < 90) * 255
        m = cv2.dilate(m, np.ones((3, 3), np.uint8))
        im[y0 - 12:y1 + 12, x0 - 12:x1 + 12] = cv2.inpaint(im[y0 - 12:y1 + 12, x0 - 12:x1 + 12], m[y0 - 12:y1 + 12, x0 - 12:x1 + 12], 3, cv2.INPAINT_TELEA)
    for ax, x0, y0, x1, y1 in CLEAN.get(n, []):
        a, b, c, d = [round(v * K) for v in (x0, y0, x1, y1)]
        if ax == 'row': im[b:d, a:c] = im[b - 8, a:c]
        else: im[b:d, a:c] = im[b:d, a - 8][:, None]
    w = WIDTHS.get(n)
    if w and w < 1440:  # the frame stops short of the page width: carry its edge on
        e = round((w - 6) * K); im[:, e:] = im[:, e - 1][:, None]
    return im
for name, seq in FLOWS.items():
    out = f'out-portal-{name}'; os.makedirs(out, exist_ok=True)
    for f in os.listdir(out): os.remove(os.path.join(out, f))
    frames, taps, t, n = [], [], 0.0, 0
    def add(img, at):
        global n
        fn = f'f{n:05d}.jpg'; cv2.imwrite(os.path.join(out, fn), img[:1250, :2000], [cv2.IMWRITE_JPEG_QUALITY, 90]); frames.append({'t': round(at, 3), 'file': fn}); n += 1
    for i, (scr, clicks) in enumerate(seq):
        im = load(scr)
        view = im
        add(view, t)
        if scr in PAN:
            t += 0.9
            span = im.shape[1] - 2000
            steps = int(PAN[scr] * 24)
            for s in range(1, steps + 1):
                p = s / steps; p = p * p * (3 - 2 * p); x = round(span * p)
                t += 1 / 24; add(im[:, x:x + 2000], t)
            view = im[:, span:span + 2000]
        for c in clicks:
            t += HOLD; add(view, t); taps.append({'t': round(t, 3), 'x': c[0], 'y': c[1]})
        if i + 1 < len(seq):
            t += AFTER; add(view, t)
            nxt = load(seq[i + 1][0])[:1250, :2000]
            for s in range(1, STEPS + 1):
                add(cv2.addWeighted(view[:1250, :2000], 1 - s / STEPS, nxt, s / STEPS, 0), t + FADE * s / STEPS)
            t += FADE
        else:
            t += END; add(view, t)
    json.dump({'w': 2000, 'h': 1250, 'css': [1440, 900], 'frames': frames, 'marks': [], 'taps': taps}, open(f'{out}/index.json', 'w'))
    json.dump({'W': 1200, 'H': 750, 'fps': 30, 'bitrate': 1500000, 'raw': True, 'cursor': True, 'scenes': [{'kind': 'desk', 'src': out, 'speed': 1, 'maxHold': 3, 'tail': 2.6}]}, open(f'cfg-portal-{name}.json', 'w'))
    print(name, len(frames), 'frames', round(t, 1), 's', len(taps), 'clicks')
