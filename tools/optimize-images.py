# Makes the site's JPEGs light enough for the web: progressive, quality 80, no wider than they are
# ever shown (backgrounds 2000 px, everything else 1600 px). Only rewrites a file if it gets at least
# 10% smaller, so running it again is safe. usage: python3 tools/optimize-images.py [backup-dir]
import glob
import os
import shutil
import sys
import cv2

backup = sys.argv[1] if len(sys.argv) > 1 else None
before = after = 0
for f in sorted(glob.glob('public/**/*.jp*g', recursive=True)):
    size = os.path.getsize(f)
    if size < 120 * 1024:
        continue
    im = cv2.imread(f)
    cap = 2000 if os.path.basename(f).startswith('bg') else 1600
    if im.shape[1] > cap:
        im = cv2.resize(im, (cap, round(im.shape[0] * cap / im.shape[1])), interpolation=cv2.INTER_AREA)
    ok, buf = cv2.imencode('.jpg', im, [cv2.IMWRITE_JPEG_QUALITY, 80, cv2.IMWRITE_JPEG_PROGRESSIVE, 1, cv2.IMWRITE_JPEG_OPTIMIZE, 1])
    if ok and len(buf) < size * 0.9:
        if backup:
            dst = os.path.join(backup, f); os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copy2(f, dst)
        open(f, 'wb').write(buf.tobytes())
        before += size; after += len(buf)
        print(f'{f}: {size // 1024} -> {len(buf) // 1024} KB')
print(f'total {before / 1048576:.1f} MB -> {after / 1048576:.1f} MB')
