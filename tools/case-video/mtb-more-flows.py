# More MTB Pay Merchant Motion UI flows, played from the Figma boards in Merchant.zip
# (the app has no recording). Each flow is the top row of one board section:
#   dyn     Payment Receive  "Merchant Dynamic QR - Set Amount"
#   fund    eMoney Manage    "Fund Out to SuperAgent with Scan QR"
#   refund  Refund           "Refund from Refundable Transaction"
#   bill    Bill Payment     "Bill Payment - YESC"
#   topup   Top Up           "Top Up"
# Frames are cut at the positions below (found by finding each phone frame on the board),
# Figma's connector lines and dots (two exact colours the app never uses) are inpainted, and
# the screens are played like a recording: taps, typing, scrolling long screens, PIN digits,
# sheets and pushes. Writes out-mtb-<flow>/ + cfg-mtb-<flow>.json for compose.mjs.
#   python3 mtb-more-flows.py <dir with the Merchant.zip PDFs> [flow ...]
#   node compose.mjs cfg-mtb-<flow>.json mtb-<flow>.mp4
import json, os, sys
import numpy as np, cv2, fitz
from PIL import Image, ImageDraw

DIR = sys.argv[1]
ONLY = sys.argv[2:]
S, FW, BAR, VH, FPS = 2, 390, 47, 797, 30   # px per pt, frame width, status bar, app viewport, fps
FLOWS = {  # pdf, [(x, y, h)] frame tops on the board, in pt
  'dyn': ('Payment Receive - English.pdf', [(7324, 3964, 844), (7806, 3964, 844), (8286, 3964, 844), (8768, 3964, 844), (9248, 3964, 844), (9730, 3964, 910)]),
  'fund': ('eMoney Manage - English.pdf', [(x, 1644, 844) for x in (7416, 7896, 8378, 8858, 9340, 9820, 10302, 10782, 11264, 11744, 12226, 12706, 13188, 13668, 14150)]),
  'refund': ('Refund - English.pdf', [(458, 1268, 964)] + [(x, 1268, 844) for x in (938, 1420, 1900, 2382, 2862, 3344, 3824, 4306, 4786, 5268, 5748, 6230, 6710)]),
  'bill': ('Bill Payment - English.pdf', [(354, 840, 844), (836, 850, 844), (1316, 850, 844), (1798, 840, 994), (2278, 840, 994), (2760, 840, 994), (3240, 840, 844), (3722, 840, 1114)]),
  'topup': ('Top Up - English.pdf', [(x, 914, 844) for x in (352, 832, 1314, 1794, 2276, 2756, 3238, 3718)]),
}
CONNECTORS = [(177, 195, 255), (104, 60, 188), (0, 105, 230)]  # Figma prototype lines: light blue, purple, selected blue

def load(pdf, frames):
    page = fitz.open(os.path.join(DIR, pdf))[0]; out = []
    for x, y, h in frames:
        pix = page.get_pixmap(clip=fitz.Rect(x, y, x + FW, y + h), matrix=fitz.Matrix(S, S))
        a = np.frombuffer(pix.samples, np.uint8).reshape(pix.h, pix.w, pix.n)[:, :, :3].copy()
        # exact connector colours only, and only solid lines and dots: the soft edges of the
        # app's own blue text come close to connector blue, so specks are left alone
        m = np.zeros(a.shape[:2], np.uint8)
        for c in CONNECTORS: m |= (np.abs(a.astype(int) - c).sum(2) < 18).astype(np.uint8)
        k, lab, st, _ = cv2.connectedComponentsWithStats(m)
        keep = [i for i in range(1, k) if st[i, 4] >= 40 and max(st[i, 2], st[i, 3]) >= 14]
        m = np.isin(lab, keep).astype(np.uint8)
        m = cv2.dilate(m, np.ones((7, 7), np.uint8))
        if m.any(): a = cv2.inpaint(a, m, 4, cv2.INPAINT_TELEA)
        out.append(Image.fromarray(a[BAR * S:]))  # the app body; the composer draws the status bar
    return out

ease = lambda a: 4 * a ** 3 if a < 0.5 else 1 - (-2 * a + 2) ** 3 / 2
out_ = lambda a: 1 - (1 - a) ** 3
P = lambda v: round(v * S)
Y = lambda v: round((v - BAR) * S)  # frame y (pt) → body px

class Reel:
    def __init__(self, name, screens):
        self.out = f'out-mtb-{name}'; self.name = name; self.sc = screens
        self.t, self.frames, self.marks, self.taps = 0.0, [], [], []
        os.makedirs(self.out, exist_ok=True)
        for f in os.listdir(self.out): os.remove(os.path.join(self.out, f))
        self.W = screens[0].width
    def v(self, img, off=0):  # what the phone shows: the viewport of a (maybe long) screen
        img = self.sc[img] if isinstance(img, int) else img
        return img.crop((0, P(off), self.W, P(off) + P(VH)))
    def emit(self, img, at):
        fn = f'f{len(self.frames):05d}.jpg'; img.convert('RGB').save(os.path.join(self.out, fn), quality=90); self.frames.append({'t': round(at, 3), 'file': fn})
    def hold(self, img, d): self.emit(img, self.t); self.t += d
    def motion(self, fn, d):
        n = max(2, round(d * FPS))
        for k in range(n): self.emit(fn(k / (n - 1)), self.t + k / FPS)
        self.t += d
    def tap(self, x, y, off=0): self.taps.append({'t': round(self.t, 3), 'x': x, 'y': y - BAR - off}); self.t += 0.15
    def mark(self, text): self.marks.append({'t': round(self.t, 3), 'cap': text})
    def push(self, a, b, d=0.42):
        W, H = a.size
        def f(k):
            e = ease(k); c = Image.new('RGB', (W, H))
            c.paste(Image.blend(a, Image.new('RGB', (W, H), 0), 0.18 * e), (round(-0.3 * W * e), 0))
            x = round(W * (1 - e))
            sh = Image.linear_gradient('L').rotate(90, expand=True).resize((40, H)).point(lambda v: int(v * 0.25 * (1 - e)))
            c.paste(Image.new('RGB', (40, H), 0), (x - 40, 0), sh); c.paste(b, (x, 0)); return c
        self.motion(f, d)
    def fade(self, a, b, d=0.3): self.motion(lambda k: Image.blend(a, b, ease(k)), d)
    def rise(self, a, b, top, d=0.45):  # a sheet comes up over a dimmed page (top: the sheet's top, frame pt)
        t = Y(top); W, H = a.size; sheet = b.crop((0, t, W, H))
        def f(k):
            e = out_(k); c = Image.blend(a, b, e)
            c.paste(a.crop((0, t, W, H)).point(lambda v: v * (1 - 0.3 * e)), (0, t))
            c.paste(sheet, (0, t + round((H - t) * (1 - e)))); return c
        self.motion(f, d)
    def share(self, a, b): self.rise(a, b, BAR + next(y for y in range(Y(250), b.height) if np.array(b)[y, b.width // 2].mean() > 235) / S)
    def scroll(self, i, a, b, d): self.motion(lambda k: self.v(i, a + (b - a) * ease(k)), d)
    def type(self, base, src, x0, x1, y0, y1, d=1.0, caret=(239, 68, 68)):
        """reveal the text of `src` inside (x0..x1, y0..y1) frame pt, left to right, over `base`"""
        def f(k):
            c = base.copy(); x = P(x0 + (x1 - x0) * k)
            if x > P(x0): c.paste(src.crop((P(x0), Y(y0), x, Y(y1))), (P(x0), Y(y0)))
            ImageDraw.Draw(c).line([(x + S, Y(y0) + 3 * S), (x + S, Y(y1) - 3 * S)], fill=caret, width=S); return c
        self.motion(f, d)
    def digits(self, img, x0, step, w, yc, n=6, d=1.2, h=30):  # PIN / OTP boxes filling one by one
        def at(m):
            c = img.copy(); dr = ImageDraw.Draw(c)
            for i in range(m):
                bx = x0 + i * step; dr.rectangle((P(bx + 2), Y(yc - h / 2 + 2), P(bx + w - 2), Y(yc + h / 2 - 2)), fill=(255, 255, 255))
                cx, cy = P(bx + w / 2), Y(yc); dr.ellipse((cx - P(5), cy - P(5), cx + P(5), cy + P(5)), fill=(17, 17, 17))
            return c
        for m in range(1, n + 1): self.hold(at(m), d / n)
        return at(n)
    def save(self):
        self.emit(Image.open(os.path.join(self.out, self.frames[-1]['file'])), self.t)  # the last screen holds until here
        json.dump({'w': self.W, 'h': P(VH), 'css': [FW, VH], 'frames': self.frames, 'marks': self.marks, 'taps': self.taps}, open(f'{self.out}/index.json', 'w'))
        json.dump({'W': 480, 'H': 1043, 'fps': 30, 'bitrate': 1100000, 'raw': True, 'scenes': [{'kind': 'phone', 'src': self.out, 'speed': 1, 'maxHold': 3, 'tail': 1.2}], 'cursor': True}, open(f'cfg-mtb-{self.name}.json', 'w'))
        print(self.name, len(self.frames), 'frames', round(self.t, 2), 's')
        print(json.dumps([{'t': m['t'], 'text': m['cap']} for m in self.marks], ensure_ascii=False))

def patch(dst, src, y0, y1, x0=0, x1=FW):  # copy a band of frame pt from src onto a copy of dst
    c = dst.copy(); c.paste(src.crop((P(x0), Y(y0), P(x1), Y(y1))), (P(x0), Y(y0))); return c
def blank(img, x0, y0, x1, y1):
    c = img.copy(); ImageDraw.Draw(c).rectangle((P(x0), Y(y0), P(x1), Y(y1)), fill=(255, 255, 255)); return c

def dyn(r):
    v = r.v
    r.mark('Open the shop’s QR')
    r.hold(v(0), 1.0); r.tap(289, 148); r.fade(v(0), v(1))
    r.hold(v(1), 1.4)
    r.mark('Add an amount to it')
    r.tap(195, 704); r.rise(v(1), v(2), 544)
    r.hold(v(2), 0.8); r.tap(196, 696); r.fade(v(2), v(3), 0.35)
    r.mark('Type the amount')
    r.hold(v(3), 0.4)
    keys = [(67, 575), (195, 743), (195, 743), (195, 743), (195, 743), (195, 743)]
    t0 = r.t
    r.type(v(3), v(4), 28, 84, 378, 401, d=1.3)
    for i, (x, y) in enumerate(keys): r.taps.append({'t': round(t0 + 0.05 + i * 0.21, 3), 'x': x, 'y': y - BAR})
    r.fade(patch(v(3), v(4), 378, 401, 20, 120), v(4), 0.2)
    r.hold(v(4), 0.6)
    r.mark('Confirm, and the QR asks for it')
    r.tap(195, 464); r.fade(v(4), v(5), 0.4)
    r.hold(v(5), 2.6)

def fund(r):
    v = r.v
    r.mark('Open eMoney')
    r.hold(v(0), 1.0); r.tap(123, 764); r.push(v(0), v(1))
    r.mark('Fund out to a Super Agent')
    r.hold(v(1), 0.9); r.tap(196, 208); r.push(v(1), v(2))
    r.hold(v(2), 0.8); r.tap(196, 157); r.push(v(2), v(3))
    r.mark('Scan the agent’s QR')
    bx0, bx1, by0, by1 = P(92), P(302), Y(228), Y(434)
    def sweep(k):
        c = v(3).copy(); o = Image.new('RGBA', c.size, (0, 0, 0, 0)); d = ImageDraw.Draw(o)
        y = by0 + (by1 - by0) * (0.5 - 0.5 * np.cos(k * 2 * np.pi))
        for g in range(24): d.line([(bx0, y - g * S), (bx1, y - g * S)], fill=(239, 68, 68, int(120 * (1 - g / 24) ** 1.5)), width=S)
        d.line([(bx0, y), (bx1, y)], fill=(255, 70, 70, 255), width=3 * S); c.paste(o, (0, 0), o); return c
    r.hold(v(3), 0.3); r.motion(sweep, 1.5); r.push(v(3), v(4))
    r.mark('Pick an amount, add a remark')
    r.hold(v(4), 1.0)
    chip = patch(patch(v(5), v(4), 600, 660), v(4), 765, 815)
    r.tap(71, 344); r.fade(v(4), chip, 0.2); r.hold(chip, 0.6)
    r.tap(196, 629); b = blank(chip, 22, 615, 340, 643); r.hold(b, 0.3)
    r.type(b, v(5), 29, 198, 615, 643, d=1.2)
    r.fade(patch(chip, v(5), 600, 660), v(5), 0.2); r.hold(v(5), 0.6)
    r.tap(195, 789); r.push(v(5), v(6))
    r.mark('Check the summary')
    r.hold(v(6), 2.0); r.tap(195, 789); r.fade(v(6), v(9), 0.35)
    r.mark('Confirm with your PIN')
    r.hold(v(9), 0.4); last = r.digits(v(9), 50, 50, 39, 280); r.hold(last, 0.3)
    r.push(last, v(10))
    r.mark('Then the code sent by SMS')
    r.hold(v(10), 0.5); last = r.digits(v(10), 50, 50.7, 40, 412); r.hold(last, 0.3)
    r.fade(last, v(11), 0.4)
    r.mark('Done, with a receipt')
    r.hold(v(11), 1.6); r.tap(296, 497); r.push(v(11), v(12))
    r.hold(v(12), 1.3)
    r.mark('Share it')
    r.tap(357, 77); r.share(v(12), v(13)); r.hold(v(13), 2.0)

def refund(r):
    v = r.v
    r.mark('Open Refund')
    r.hold(v(0), 1.0); r.tap(332, 449); r.push(v(0), v(1))
    r.mark('Find the payment by its number')
    r.hold(v(1), 0.9); r.tap(196, 213)
    b = blank(v(1), 55, 200, 330, 226); r.hold(b, 0.25)
    r.type(b, v(2), 57, 194, 200, 226, d=1.1, caret=(30, 30, 30))
    r.fade(patch(b, v(2), 200, 226, 50, 340), v(2), 0.3); r.hold(v(2), 0.8)
    r.tap(192, 329); r.push(v(2), v(3))
    r.mark('Check the payment, then refund')
    r.hold(v(3), 1.8); r.tap(195, 789); r.rise(v(3), v(4), 549)
    r.mark('Give a reason')
    r.hold(v(4), 0.7); r.tap(195, 700); r.fade(v(4), v(5), 0.35)
    r.type(v(5), v(6), 27, 140, 336, 362, d=1.1, caret=(30, 30, 30))
    r.fade(patch(v(5), v(6), 336, 362, 20, 160), v(6), 0.2); r.hold(v(6), 0.5)
    r.tap(195, 424); r.push(v(6), v(7))
    r.mark('Check the summary')
    r.hold(v(7), 1.8); r.tap(195, 789); r.fade(v(7), v(10), 0.35)
    r.mark('Confirm with your PIN')
    r.hold(v(10), 0.4); last = r.digits(v(10), 50, 50, 39, 281); r.hold(last, 0.3)
    r.fade(last, v(11), 0.4)
    r.mark('Refunded, with a receipt')
    r.hold(v(11), 1.6); r.tap(296, 481); r.push(v(11), v(12))
    r.hold(v(12), 1.3)
    r.mark('Share it')
    r.tap(357, 79); r.share(v(12), v(13)); r.hold(v(13), 2.0)

def bill(r):
    v = r.v
    r.mark('Pick the bill')
    r.hold(v(0), 1.2); r.tap(80, 309); r.push(v(0), v(1))
    r.mark('Choose YESC, enter the barcode')
    r.hold(v(1), 0.8); r.tap(196, 184)
    svc = patch(v(1), v(2), 148, 205); r.fade(v(1), svc, 0.25); r.hold(svc, 0.6)
    r.tap(196, 280); b = blank(svc, 20, 268, 300, 292); r.hold(b, 0.25)
    r.type(b, v(2), 28, 113, 268, 292, d=1.0, caret=(30, 30, 30))
    r.fade(patch(svc, v(2), 266, 294), v(2), 0.2); r.hold(v(2), 0.5)
    r.tap(195, 789); r.push(v(2), v(3))
    r.mark('Check the whole bill')
    r.hold(v(3), 1.2); r.scroll(3, 0, 150, 1.4); r.hold(v(3, 150), 0.6)
    r.tap(195, 937, 150); r.fade(v(3, 150), v(4), 0.35)
    r.mark('Confirm with your PIN')
    r.hold(v(4), 0.4); last = r.digits(v(4), 50, 50.4, 41, 296); r.hold(last, 0.3)
    r.fade(last, v(6), 0.4)
    r.mark('Paid')
    r.hold(v(6), 1.6); r.tap(296, 481); r.push(v(6), v(7))
    r.mark('Every detail in History')
    r.hold(v(7), 1.0); r.scroll(7, 0, 270, 2.0); r.hold(v(7, 270), 1.6)

def topup(r):
    v = r.v
    r.mark('Type the number')
    r.hold(v(0), 0.8); r.tap(196, 184)
    b = blank(v(0), 40, 172, 330, 196); r.hold(b, 0.2)
    r.type(b, v(1), 40, 166, 172, 196, d=1.1, caret=(30, 30, 30))
    r.fade(patch(b, v(1), 172, 196, 20, 340), v(1), 0.35)
    r.mark('Pick an amount')
    r.hold(v(1), 0.8); r.tap(72, 340); r.fade(v(1), v(2), 0.2); r.hold(v(2), 0.6)
    r.tap(195, 791); r.push(v(2), v(3))
    r.mark('Check the summary')
    r.hold(v(3), 1.8); r.tap(195, 791); r.fade(v(3), v(4), 0.35)
    r.mark('Confirm with your PIN')
    r.hold(v(4), 0.4); last = r.digits(v(4), 51, 50.7, 41, 299); r.hold(last, 0.3)
    r.fade(last, v(5), 0.4)
    r.mark('Topped up')
    r.hold(v(5), 1.3)
    r.mark('Save the receipt')
    r.tap(195, 729); r.fade(v(5), v(6), 0.25); r.hold(v(6), 1.3)
    r.mark('Every detail in History')
    r.tap(296, 481); r.push(v(6), v(7)); r.hold(v(7), 2.2)

for name, play in [('dyn', dyn), ('fund', fund), ('refund', refund), ('bill', bill), ('topup', topup)]:
    if ONLY and name not in ONLY: continue
    pdf, frames = FLOWS[name]
    r = Reel(name, load(pdf, frames)); play(r); r.save()
