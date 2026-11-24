from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

W,H=1600,900
base=Image.open('.tmp-refs/footage/hero_base.jpg').convert('RGB')
mark=Image.open('.tmp-refs/build/mark-white.png').convert('RGBA')
a=np.array(mark)
alpha=Image.fromarray(a[:,:,3])
bbox=alpha.getbbox()
mark=mark.crop(bbox)

CREAM=(247,238,236)
# tint
m=np.array(mark).astype(np.float32)
m[:,:,:3]=CREAM
mark=Image.fromarray(m.astype(np.uint8),'RGBA')

mh=300
mw=int(round(mark.width*mh/mark.height))
mark=mark.resize((mw,mh),Image.LANCZOS)

# shadow
sh=mask=mark.split()[3].filter(ImageFilter.GaussianBlur(14))
shl=Image.new('RGBA',(W,H),(0,0,0,0))
shl.paste((58,32,44,150),(0,0),sh)
# position
cx=W//2
my=250
mx=cx-mw//2
canvas=Image.new('RGBA',(W,H),(0,0,0,0))
canvas.alpha_composite(shl,(0,6))
canvas.alpha_composite(mark,(mx,my))
d=ImageDraw.Draw(canvas)
# rule
ry=my+mh+56
d.rectangle([cx-52,ry,cx+52,ry+1],fill=(247,238,236,150))
# wordmark
font=ImageFont.truetype('.tmp-motion/fonts/Jost.ttf',24)
font.set_variation_by_name('Medium')
word='WOMENSWEAR'
tr=0.34
widths=[font.getlength(c) for c in word]
tw=sum(widths)+tr*24*(len(word)-1)
x=cx-tw/2
by=ry+58
for c,w in zip(word,widths):
    d.text((x,by),c,font=font,fill=(247,238,236,235),anchor='ls')
    x+=w+tr*24
out=base.convert('RGBA')
out.alpha_composite(canvas)
out.convert('RGB').save('.tmp-refs/footage/comp_test.jpg',quality=88)
print('saved')
