import numpy as np, cv2, os, sys

OUT = '.tmp-brand/cloth'
os.makedirs(OUT, exist_ok=True)
W, H = 1280, 720

def load(path):
    im = cv2.imread(path, cv2.IMREAD_COLOR)
    im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)
    return im.astype(np.float32) / 255.0

def poly(shape, pts, feather=0, dilate=0):
    m = np.zeros(shape[:2], np.float32)
    cv2.fillPoly(m, [np.array(pts, np.int32)], 1.0)
    if dilate:
        m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (dilate * 2 + 1, dilate * 2 + 1)))
    if feather:
        m = cv2.GaussianBlur(m, (0, 0), feather)
    return np.clip(m, 0, 1)

def shade(img, Dx, Dy, weight, light_deg, k_div, k_dir):
    gx = cv2.Sobel(Dx, cv2.CV_32F, 1, 0, ksize=3) / 8.0
    gy = cv2.Sobel(Dy, cv2.CV_32F, 0, 1, ksize=3) / 8.0
    div = cv2.GaussianBlur(gx + gy, (0, 0), 9.0)
    th = np.deg2rad(light_deg)
    dirg = cv2.GaussianBlur(gx, (0, 0), 9.0) * np.cos(th) + cv2.GaussianBlur(gy, (0, 0), 9.0) * np.sin(th)
    mult = 1.0 + weight * (k_div * div + k_dir * dirg)
    mult = np.clip(mult, 0.86, 1.14)
    return np.clip(img * mult[..., None], 0, 1)

def render(img, act, pin, layers, frames=150, T=5.0, light=135.0, k_div=1.3, k_dir=0.6, cam=1.5):
    yg, xg = np.mgrid[0:H, 0:W].astype(np.float32)
    eff = act * (1 - pin)
    out = []
    for i in range(frames):
        t = i * T / frames
        Dx = np.zeros_like(xg); Dy = np.zeros_like(xg)
        for (A, f, m, deg, ph, tr) in layers:
            th = np.deg2rad(deg); c, s = np.cos(th), np.sin(th)
            u = (c * xg + s * yg) / W
            w = np.sin(2 * np.pi * (f * u + m * t / T + ph))
            Dx += A * w * (-s) + tr * A * w * c
            Dy += A * w * (c) + tr * A * w * s
        Dx *= eff; Dy *= eff
        cs = cam * np.sin(2 * np.pi * t / T)
        warped = cv2.remap(img, (xg - Dx + cs).astype(np.float32), (yg - Dy).astype(np.float32),
                           cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT_101)
        out.append(shade(warped, Dx, Dy, eff, light, k_div, k_dir))
    return out

CONF = {
    'fem': dict(
        src='/Users/saimyothu/vibe_images/uz-id-feminine-still_1795110831834_20c9563e.png',
        pins=[[(620, 0), (900, 0), (900, 180), (830, 300), (700, 430), (590, 440), (590, 380), (670, 300), (640, 180), (600, 60)]],
        act_base=0.9,
        act_up=[[[(0, 0), (520, 0), (520, 720), (0, 720)], 0.45]],
        layers=[(19, 0.55, 1, 20, 0.0, 0.15), (9, 1.6, 2, -35, 0.35, 0.10), (4, 3.6, 3, 65, 0.7, 0.04), (6, 0.0, 1, 90, 0.0, 0.0)],
        k_div=1.6, k_dir=0.8, cam=2.0),
    'prem': dict(
        src='/Users/saimyothu/vibe_images/uz-id-premium-still_1795110814199_0d71b323.png',
        pins=[
            [(555, 155), (700, 155), (830, 175), (925, 220), (915, 275), (835, 315), (700, 320), (595, 260)],
            [(755, 330), (980, 315), (1280, 295), (1280, 520), (1005, 525), (880, 470), (790, 465), (735, 400)],
            [(935, 0), (1180, 0), (1180, 300), (1000, 325), (930, 235)],
        ],
        act_base=0.22,
        act_up=[
            [[(240, 300), (1280, 300), (1280, 720), (240, 720)], 0.75],
            [[(880, 420), (1280, 420), (1280, 720), (880, 720)], 1.0],
            [[(0, 320), (235, 320), (205, 600), (0, 650)], 0.85],
            [[(1150, 0), (1280, 0), (1280, 360), (1150, 250)], 0.8],
        ],
        layers=[(7, 0.7, 1, 15, 0.0, 0.10), (3.5, 2.0, 2, -50, 0.3, 0.05), (1.6, 4.5, 3, 60, 0.6, 0.0)],
        k_div=1.4, k_dir=0.6, cam=1.2),
    'last': dict(
        src='/Users/saimyothu/vibe_images/uz-id-lasting-still_1795110848905_c66a8012.png',
        pins=[
            [(450, 30), (625, 25), (705, 145), (665, 225), (560, 255), (465, 190), (435, 105)],
            [(935, 145), (1120, 135), (1205, 295), (1150, 425), (1045, 475), (975, 410), (925, 295)],
            [(1030, 0), (1280, 0), (1280, 200), (1120, 190), (1000, 120)],
        ],
        act_base=0.18,
        act_up=[
            [[(450, 240), (960, 240), (980, 520), (450, 520)], 0.8],
            [[(430, 70), (1120, 60), (1160, 320), (430, 330)], 0.5],
            [[(0, 300), (430, 300), (430, 720), (0, 720)], 0.35],
        ],
        layers=[(5, 0.6, 1, 10, 0.0, 0.12), (2.5, 1.8, 2, -40, 0.4, 0.05), (1.2, 4.0, 3, 70, 0.8, 0.0)],
        k_div=1.3, k_dir=0.6, cam=1.2),
}

def main():
    which = sys.argv[1]
    c = CONF[which]
    img = load(c['src'])
    pin = np.zeros((H, W), np.float32)
    for pts in c['pins']:
        pin = np.clip(pin + poly(img.shape, pts, feather=6, dilate=9), 0, 1)
    act = np.full((H, W), c['act_base'], np.float32)
    for pts, a in c['act_up']:
        act = np.maximum(act, poly(img.shape, pts, feather=28) * a)
    frames = render(img, act, pin, c['layers'], k_div=c['k_div'], k_dir=c['k_dir'], cam=c['cam'])
    for i, fr in enumerate(frames):
        cv2.imwrite(f'{OUT}/{which}-{i:03d}.png', (fr * 255).clip(0, 255).astype(np.uint8))
    print('ok', which, len(frames))

if __name__ == '__main__':
    main()
