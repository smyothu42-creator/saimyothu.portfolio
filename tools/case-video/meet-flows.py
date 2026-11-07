# Heizen Studio Meetings flows: turns the cleaned Figma screens (made by
# meet-frames.py logic into SRC/fNN/MM.jpg) into recorder-style frame folders
# out-hs-<name>/ for compose.mjs (cfg-hs-<name>.json): each screen holds, then
# crossfades to the next. Wider screens (dashboard + Meeting List) are letterboxed.
import json, os, sys
from PIL import Image
SRC = sys.argv[1]
W, H, HOLD, FADE, STEPS = 2400, 1536, 2.4, 0.4, 10
BG = (10, 10, 10)
FLOWS = {
  'dash': ['f00/00', 'f00/01', 'f00/02', 'f00/03'],
  'start': ['f01/00', 'f01/01', 'f01/02', 'f01/03', 'f01/04', 'f01/05'],
  'review': ['f02/00', 'f02/01', 'f02/02', 'f02/03'],
  'anywhere': ['f05/00', 'f05/01', 'f05/02'] + ['f04/%02d' % i for i in range(9, 15)],
  'project': ['f03/%02d' % i for i in range(7)],
  'assign': ['f07/%02d' % i for i in range(4)],
  'move': ['f08/%02d' % i for i in range(5)],
  'wiki': ['f09/%02d' % i for i in range(4)],
  'tag': ['f10/%02d' % i for i in range(9)],
}
def fit(fn):
    im = Image.open(os.path.join(SRC, fn + '.jpg')).convert('RGB')
    s = min(W / im.width, H / im.height); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    c = Image.new('RGB', (W, H), BG); c.paste(im, ((W - im.width) // 2, (H - im.height) // 2)); return c
for name, seq in FLOWS.items():
    if len(sys.argv) > 2 and name not in sys.argv[2:]: continue
    out = f'out-hs-{name}'; os.makedirs(out, exist_ok=True)
    for f in os.listdir(out): os.remove(os.path.join(out, f))
    frames, t, n = [], 0.0, 0
    def add(img, at):
        global n
        fn = f'f{n:05d}.jpg'; img.save(os.path.join(out, fn), quality=88); frames.append({'t': round(at, 3), 'file': fn}); n += 1
    ims = [fit(s) for s in seq]
    for i, im in enumerate(ims):
        add(im, t); t += HOLD
        if i + 1 < len(ims):
            for k in range(1, STEPS + 1):
                add(Image.blend(im, ims[i + 1], k / STEPS), t + FADE * (k - 1) / STEPS)
            t += FADE
    add(ims[-1], t)  # the last screen holds until here
    json.dump({'w': W, 'h': H, 'css': [1600, 1024], 'frames': frames, 'marks': [], 'taps': []}, open(f'{out}/index.json', 'w'))
    json.dump({'W': 1200, 'H': 768, 'fps': 30, 'bitrate': 1400000, 'raw': True, 'scenes': [{'kind': 'desk', 'src': out, 'speed': 1, 'maxHold': 3, 'tail': 1.4}]}, open(f'cfg-hs-{name}.json', 'w'))
    print(name, len(seq), 'screens', round(t, 1), 's')
