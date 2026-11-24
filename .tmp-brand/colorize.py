from PIL import Image

SRC = "public/sai-swc.jpg"
GEN = "/Users/saimyothu/vibe_images/sai-swc-color_1795131843688_b6177cdd.png"
OUT = "public/sai-swc-color.jpg"

base = Image.open(SRC).convert("RGB")
gen = Image.open(GEN).convert("RGB").resize(base.size, Image.LANCZOS)

y, _, _ = base.convert("YCbCr").split()
_, cb, cr = gen.convert("YCbCr").split()

out = Image.merge("YCbCr", (y, cb, cr)).convert("RGB")
out.save(OUT, quality=92, subsampling=1, optimize=True)
print(out.size)
