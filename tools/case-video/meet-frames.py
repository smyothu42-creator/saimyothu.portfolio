# Heizen Studio Meetings: screens from Sai's Figma export (~/Downloads/Meeting.pdf),
# with Figma's prototype connector lines painted out.
# usage: python3 meet-frames.py <scale> <out.png> x y w [h]
import sys, fitz, numpy as np, cv2
s, out, x, y, w = float(sys.argv[1]), sys.argv[2], *map(float, sys.argv[3:6]); h = float(sys.argv[6]) if len(sys.argv) > 6 else 1024
d = fitz.open('/Users/saimyothu/Downloads/Meeting.pdf'); p = d[0]
clip = fitz.Rect(x, y, x + w, y + h)
conn = [dr for dr in p.get_drawings(extended=False) if dr.get('fill') and len(dr['fill']) == 3 and 0.5 < dr['fill'][0] < 0.72 and 0.55 < dr['fill'][1] < 0.75 and dr['fill'][2] > 0.95 and fitz.Rect(dr['rect']).intersects(clip)]
m = fitz.open(); mp = m.new_page(width=p.rect.width, height=p.rect.height); sh = mp.new_shape()
for dr in conn:
    for it in dr['items']:
        if it[0] == 'l': sh.draw_line(it[1], it[2])
        elif it[0] == 'c': sh.draw_bezier(it[1], it[2], it[3], it[4])
        elif it[0] == 're': sh.draw_rect(it[1])
        elif it[0] == 'qu': sh.draw_quad(it[1])
    sh.finish(fill=(0, 0, 0), color=None, even_odd=dr.get('even_odd', False), closePath=dr.get('closePath', False))
sh.commit()
pm = p.get_pixmap(matrix=fitz.Matrix(s, s), clip=clip)
im = cv2.cvtColor(np.frombuffer(pm.samples, np.uint8).reshape(pm.height, pm.width, pm.n)[:, :, :3].copy(), cv2.COLOR_RGB2BGR)
mk = mp.get_pixmap(matrix=fitz.Matrix(s, s), clip=clip, colorspace=fitz.csGRAY)
mask = (np.frombuffer(mk.samples, np.uint8).reshape(mk.height, mk.width) < 128).astype(np.uint8) * 255
if mask.any():
    k = max(3, int(round(3 * s)) | 1)
    im = cv2.inpaint(im, cv2.dilate(mask, np.ones((k, k), np.uint8)), 4, cv2.INPAINT_TELEA)
cv2.imwrite(out, im)
print(out, im.shape)
