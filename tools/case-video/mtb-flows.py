# MTB Pay Merchant Motion UI, built from Sai's Figma section "Merchant Scan Consumer QR to
# Receive Payment" (~/Downloads/Section 1.pdf), since the app has no recording. The board has
# both sides of one payment:
#   merchant (red, top row):   Scan → Receive Payment → filled → Summary → Waiting → Successful
#                              → History → Saved Receipt → share sheet
#   customer (blue, row two):  Pay With QR → Merchant Payment (loading) → Summary → PIN
#                              → Payment Successful → History
# The merchant scans the customer's Pay With QR; the customer's Payment Successful is what
# turns the merchant's Waiting into Successful.
# Screens are cut out, Figma's prototype connector dots painted out, and each side is played
# like a recording (taps, typing, push transitions, the hourglass, spinner, PIN, share sheet):
#   out-mtb-receive/ + cfg-mtb-receive.json   merchant flow
#   out-mtb-pay/     + cfg-mtb-pay.json       customer flow
#   hero-mtb/                                 key states for the cover loop (hero-mtb.html)
#   python3 mtb-flows.py "<...>/Section 1.pdf"
#   node compose.mjs cfg-mtb-receive.json mtb-receive.mp4; node compose.mjs cfg-mtb-pay.json mtb-pay.mp4
import json, os, sys
import numpy as np, cv2, fitz
from PIL import Image, ImageDraw

PDF = sys.argv[1]
S = 2                       # px per Figma pt in the frames
FW, FH, BAR = 390, 844, 47  # Figma frame, and its status bar (the composer draws its own)
MX = [232, 713, 1194, 1675, 2156, 3588, 4069, 4550, 5031]; MY = 754   # merchant frames on the board
CX = [232, 2145, 2626, 3107, 3588, 4069]; CY = 1742                   # customer frames
FPS = 30
page = fitz.open(PDF)[0]

def cut(x, y):
    pix = page.get_pixmap(clip=fitz.Rect(x, y, x + FW, y + FH), matrix=fitz.Matrix(S, S))
    a = np.frombuffer(pix.samples, np.uint8).reshape(pix.h, pix.w, pix.n)[:, :, :3].copy()
    h, w = a.shape[:2]
    # connector dots: Figma's exact connector blue, on the side edges and the bottom
    m = (np.abs(a.astype(int) - (177, 195, 255)).sum(2) < 60).astype(np.uint8)
    keep = np.zeros_like(m); keep[:, w - 40 * S:] = 1; keep[:, :12 * S] = 1; keep[h - 15 * S:, :] = 1
    m = cv2.dilate(m * keep, np.ones((5, 5), np.uint8))
    side = m.copy(); side[h - 15 * S:] = 0
    ys, xs = np.where(side > 0); a[ys, xs] = a[ys, w - 1 - xs]  # the screens are symmetric: mirror the other edge
    return a, bool(m[h - 15 * S:].any())

def body(rows):  # app body below the status bar; a connector at the bottom gets a clean bottom edge
    clean = next(a for a, bottom in rows if not bottom)
    out = []
    for a, bottom in rows:
        if bottom: a = a.copy(); a[-17 * S:] = clean[-17 * S:]
        out.append(Image.fromarray(a[BAR * S:]))
    return out

M = body([cut(x, MY) for x in MX])
C = body([cut(x, CY) for x in CX])
W, H = M[0].size
P = lambda v: round(v * S)            # pt → px
Py = lambda v: round((v - BAR) * S)   # frame y in pt → body px
ease = lambda a: 4 * a ** 3 if a < 0.5 else 1 - (-2 * a + 2) ** 3 / 2
out_ = lambda a: 1 - (1 - a) ** 3

class Reel:
    """Frames on a clock, like record.mjs writes them: hold, motion, taps and captions."""
    def __init__(self, out):
        self.out, self.t, self.frames, self.marks, self.taps = out, 0.0, [], [], []
        os.makedirs(out, exist_ok=True)
        for f in os.listdir(out): os.remove(os.path.join(out, f))
    def emit(self, img, at):
        fn = f'f{len(self.frames):05d}.jpg'; img.convert('RGB').save(os.path.join(self.out, fn), quality=90); self.frames.append({'t': round(at, 3), 'file': fn})
    def hold(self, img, d): self.emit(img, self.t); self.t += d
    def motion(self, fn, d):
        n = max(2, round(d * FPS))
        for k in range(n): self.emit(fn(k / (n - 1)), self.t + k / FPS)
        self.t += d
    def tap(self, x, y): self.taps.append({'t': round(self.t, 3), 'x': x, 'y': y - BAR}); self.t += 0.15
    def mark(self, text): self.marks.append({'t': round(self.t, 3), 'cap': text})
    def push(self, a, b, d=0.42):
        def f(k):
            e = ease(k); c = Image.new('RGB', (W, H))
            c.paste(Image.blend(a, Image.new('RGB', (W, H), 0), 0.18 * e), (round(-0.3 * W * e), 0))
            x = round(W * (1 - e))
            sh = Image.linear_gradient('L').rotate(90, expand=True).resize((40, H)).point(lambda v: int(v * 0.25 * (1 - e)))
            c.paste(Image.new('RGB', (40, H), 0), (x - 40, 0), sh)
            c.paste(b, (x, 0)); return c
        self.motion(f, d)
    def fade(self, a, b, d=0.3): self.motion(lambda k: Image.blend(a, b, ease(k)), d)
    def save(self, cfg):
        json.dump({'w': W, 'h': H, 'css': [FW, FH - BAR], 'frames': self.frames, 'marks': self.marks, 'taps': self.taps}, open(f'{self.out}/index.json', 'w'))
        json.dump({'W': 480, 'H': 1043, 'fps': 30, 'bitrate': 1100000, 'raw': True, 'scenes': [{'kind': 'phone', 'src': self.out, 'speed': 1, 'maxHold': 3, 'tail': 1.2}], 'cursor': True}, open(cfg, 'w'))
        print(self.out, len(self.frames), 'frames', round(self.t, 2), 's')
        print(json.dumps([{'t': m['t'], 'text': m['cap']} for m in self.marks], ensure_ascii=False))

def spin(im, cx, cy, r, ang):  # rotate a small round region (the hourglass, the spinner)
    box = (P(cx - r), Py(cy - r), P(cx + r), Py(cy + r)); g = im.crop(box).convert('RGBA')
    c = im.copy(); c.paste((255, 255, 255), box)
    g = g.rotate(-ang, resample=Image.BICUBIC, fillcolor=(255, 255, 255, 0)); c.paste(g, box[:2], g); return c

def share_up(r, a, b):  # dim the page, the share sheet slides up from the bottom
    arr = np.array(b); top = next(y for y in range(Py(250), H) if arr[y, W // 2].mean() > 235)
    sheet = b.crop((0, top, W, H))
    def f(k):
        e = out_(k); c = Image.blend(a, b, e)
        c.paste(a.crop((0, top, W, H)).point(lambda v: v * (1 - 0.35 * e)), (0, top))
        c.paste(sheet, (0, top + round((H - top) * (1 - e)))); return c
    r.motion(f, 0.45); return top

# ---------------- merchant: scan the customer's QR to receive a payment ----------------
r = Reel('out-mtb-receive')
bx0, bx1, by0, by1 = P(92), P(302), Py(335), Py(545)
def sweep(k):
    c = M[0].copy(); o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(o)
    y = by0 + (by1 - by0) * (0.5 - 0.5 * np.cos(k * 2 * np.pi))
    for g in range(24):  # glow trailing the line
        d.line([(bx0, y - g * S), (bx1, y - g * S)], fill=(239, 68, 68, int(120 * (1 - g / 24) ** 1.5)), width=S)
    d.line([(bx0, y), (bx1, y)], fill=(255, 70, 70, 255), width=3 * S)
    c.paste(o, (0, 0), o); return c
r.mark('Scan the customer’s QR')
r.hold(M[0], 0.5)
r.motion(sweep, 1.6)
r.motion(lambda k: Image.blend(M[0], Image.new('RGB', (W, H), (255, 255, 255)), 0.35 * (1 - abs(2 * k - 1))), 0.25)  # read
r.push(M[0], M[1])

r.mark('The sender and their balance come up')
r.hold(M[1], 1.3)
chip = M[2].copy()  # amount picked, remark still empty, Next still off
for y0, y1 in [(600, 645), (758, 820)]: chip.paste(M[1].crop((0, Py(y0), W, Py(y1))), (0, Py(y0)))
r.mark('Tap an amount')
r.tap(70, 392)
r.fade(M[1], chip, 0.2)
r.hold(chip, 1.0)
blank = chip.copy(); blank.paste((255, 255, 255), (P(24), Py(608), P(340), Py(637)))
r.mark('Add a remark')
r.tap(195, 622)
r.hold(blank, 0.35)
tx0, tx1 = P(29), P(139)
def typing(k):
    c = blank.copy(); x = round(tx0 + (tx1 - tx0) * k)
    c.paste(M[2].crop((tx0, Py(608), x, Py(637))), (tx0, Py(608)))
    ImageDraw.Draw(c).line([(x + S, Py(613)), (x + S, Py(632))], fill=(239, 68, 68), width=S)
    return c
r.motion(typing, 1.1)
typed = chip.copy(); typed.paste(M[2].crop((0, Py(600), W, Py(645))), (0, Py(600)))
r.fade(typed, M[2], 0.2)  # Next turns on
r.hold(M[2], 0.8)
r.tap(195, 790)
r.push(M[2], M[3])

r.mark('Check the summary, then confirm')
r.hold(M[3], 2.0)
r.tap(195, 790)
r.push(M[3], M[4])

r.mark('Wait while the customer confirms on their phone')
r.hold(M[4], 0.6)
r.motion(lambda k: spin(M[4], 195, 308, 54, 180 * ease(k)), 0.7)
r.hold(spin(M[4], 195, 308, 54, 180), 0.5)
r.motion(lambda k: spin(M[4], 195, 308, 54, 180 * (1 + ease(k))), 0.7)
r.hold(M[4], 0.3)

r.mark('The customer paid, and it says so')
r.fade(M[4], M[5], 0.4)
r.hold(M[5], 1.6)
r.tap(294, 480)
r.push(M[5], M[6])

r.mark('Save or share the receipt')
r.hold(M[6], 1.3)
r.tap(195, 727)
r.fade(M[6], M[7], 0.25)
r.hold(M[7], 1.4)
r.tap(357, 76)
mtop = share_up(r, M[7], M[8])
r.hold(M[8], 2.0)
r.emit(M[8], r.t)
r.save('cfg-mtb-receive.json')

# ---------------- customer: pay the shop from MTB Pay ----------------
c = Reel('out-mtb-pay')
c.mark('Show your QR at the counter')
c.hold(C[0], 2.4)
c.mark('The shop’s request comes in')
c.fade(C[0], C[1], 0.3)
c.motion(lambda k: spin(C[1], 195, 427, 22, 900 * k), 1.3)  # loading
c.push(C[1], C[2])
c.mark('Check who you’re paying, and how much')
c.hold(C[2], 2.2)
c.tap(195, 790)
c.fade(C[2], C[3], 0.3)
c.mark('Confirm with your PIN')
c.hold(C[3], 0.5)
def pin(n):
    im = C[3].copy(); d = ImageDraw.Draw(im)
    for i in range(n):
        x0, x1 = P(50 + i * 50), P(89 + i * 50); d.rectangle((x0, Py(265), x1, Py(296)), fill=(255, 255, 255))
        cx, cy = (x0 + x1) // 2, Py(280.5); d.ellipse((cx - P(5), cy - P(5), cx + P(5), cy + P(5)), fill=(17, 17, 17))
    return im
for n in range(1, 7): c.hold(pin(n), 0.2)
c.hold(pin(6), 0.3)
c.mark('Paid, and the shop sees it')
c.fade(pin(6), C[4], 0.4)
c.hold(C[4], 1.8)
c.tap(294, 577)
c.push(C[4], C[5])
c.mark('Every detail in History')
c.hold(C[5], 2.4)
c.emit(C[5], c.t)
c.save('cfg-mtb-pay.json')

# ---------------- key states for the cover loop ----------------
os.makedirs('hero-mtb', exist_ok=True)
for name, im in [('s0', M[0]), ('s1', M[1]), ('chip', chip), ('blank', blank), ('s2', M[2]), ('s3', M[3]), ('s4', M[4]),
                 ('s5', M[5]), ('s6', M[6]), ('s7', M[7]), ('s8', M[8])] + [(f'c{i}', im) for i, im in enumerate(C)]:
    im.save(f'hero-mtb/{name}.jpg', quality=92)
print('merchant share sheet top (pt in app body):', round(mtop / S, 1))
