# The MTB Pay Merchant film has no screen recording: this lays the Figma screens (out-mtb/*-body.png,
# export edges trimmed) on one timeline, as out-mtb-film/ with the index.json film.html reads, so the
# demo scenes can play each flow as a run of screens. usage: python3 mtb-film.py
# (The current film tells one sale with the scan/wait/paid/receipt scenes instead of demos.)
import json
import os
import cv2

FLOW = [  # screen, seconds on the timeline
    ('home', 4),
    ('topup-amount', 3), ('topup-summary', 3), ('topup-done', 3),
    ('receive-qr', 3), ('receive-amount', 2), ('receive-wait', 2), ('receive-done', 3),
    ('refund-list', 3), ('refund-reason', 2), ('refund-summary', 2), ('refund-done', 3),
]
os.makedirs('out-mtb-film', exist_ok=True)
frames, t = [], 0.0
for i, (name, secs) in enumerate(FLOW):
    im = cv2.imread(f'out-mtb/{name}-body.png')[:-17, :-4]
    im = cv2.resize(im, (804, round(804 * im.shape[0] / im.shape[1])), interpolation=cv2.INTER_AREA)
    f = f'f{i:05d}.jpg'
    cv2.imwrite(f'out-mtb-film/{f}', im, [cv2.IMWRITE_JPEG_QUALITY, 92])
    frames.append({'t': t, 'file': f}); t += secs
# The shop's QR card, for the scan scene of the ending (film-mtb.json).
q = cv2.imread('out-mtb/receive-qr-body.png')
cv2.imwrite('out-mtb-film/qr-card.png', q[422:1571, 100:1066])
json.dump({'w': 804, 'h': im.shape[0], 'frames': frames, 'marks': []}, open('out-mtb-film/index.json', 'w'))
print('timeline', t, 's,', len(frames), 'screens, h', im.shape[0])
