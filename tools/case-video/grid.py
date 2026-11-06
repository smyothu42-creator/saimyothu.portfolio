import json,sys
from PIL import Image, ImageDraw
d=sys.argv[1]; ts=[float(x) for x in sys.argv[3].split(',')]; out=sys.argv[2]; W=int(sys.argv[4]) if len(sys.argv)>4 else 260
fr=json.load(open(d+'/index.json'))['frames']
at=lambda t: max([f for f in fr if f['t']<=t] or fr[:1], key=lambda f:f['t'])['file']
ims=[]
for t in ts:
    im=Image.open(d+'/'+at(t)).convert('RGB'); h=int(im.height*W/im.width); im=im.resize((W,h)); dr=ImageDraw.Draw(im)
    for k in range(1,10):
        dr.line([(W*k/10,0),(W*k/10,h)],fill=(255,0,0),width=1); dr.line([(0,h*k/10),(W,h*k/10)],fill=(255,0,0),width=1)
        dr.text((W*k/10+2,2),str(k),fill=(255,0,0)); dr.text((2,h*k/10+1),str(k),fill=(255,0,0))
    dr.text((4,h-14),f"{t}",fill=(0,0,255)); ims.append(im)
o=Image.new('RGB',(sum(i.width+6 for i in ims),max(i.height for i in ims)),'white'); x=0
for i in ims: o.paste(i,(x,0)); x+=i.width+6
o.save(out)
