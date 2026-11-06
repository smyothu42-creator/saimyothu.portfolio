import json,sys
from PIL import Image
d=sys.argv[1]; idx=json.load(open(f'{d}/index.json')); fr=idx['frames']
ts=[m['t']+float(sys.argv[2] if len(sys.argv)>2 else 1.5) for m in idx['marks']]+[fr[-1]['t']]
pick=[max([f for f in fr if f['t']<=t] or fr[:1], key=lambda f:f['t']) for t in ts]
ims=[Image.open(f"{d}/{p['file']}") for p in pick]
w=360; h=int(ims[0].height*w/ims[0].width)
o=Image.new('RGB',(w*4+30, (h+10)*((len(ims)+3)//4)),'white')
for k,im in enumerate(ims): o.paste(im.resize((w,h)),((k%4)*(w+10),(k//4)*(h+10)))
o.save(f'{d}_sheet.png'); print([m['cap'][:40] for m in idx['marks']])
