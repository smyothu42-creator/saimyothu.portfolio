const img = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src })

const phone = {}

const SCREEN_RATIO = 874 / 402

function rrect(x, y, w, h, r) { X.beginPath(); X.roundRect(x, y, w, h, r) }

function wrap(text, maxW) {
  const words = text.split(' '), lines = []; let line = ''
  for (const w of words) { const t = line ? line + ' ' + w : w; if (X.measureText(t).width > maxW && line) { lines.push(line); line = w } else line = t }
  if (line) lines.push(line); return lines
}

function screenInto(frame, x, y, w, h) {
  const appH = w * (frame.height / frame.width), band = h - appH
  const tmp = phone.t || (phone.t = document.createElement('canvas').getContext('2d', { willReadFrequently: true }))
  tmp.canvas.width = 4; tmp.canvas.height = 2; tmp.drawImage(frame, 0, 0, frame.width, 6, 0, 0, 4, 2)
  const p = tmp.getImageData(1, 0, 1, 1).data
  X.fillStyle = `rgb(${p[0]},${p[1]},${p[2]})`; X.fillRect(x, y, w, band + 2)
  X.drawImage(frame, x, y + band, w, appH)
  const dark = p[0] * 0.3 + p[1] * 0.59 + p[2] * 0.11 < 120
  X.fillStyle = dark ? '#fff' : '#111'; X.textBaseline = 'middle'
  const sy = y + band * 0.56, u = w * 0.0105
  X.font = `600 ${w * 0.043}px -apple-system, Figtree, sans-serif`; X.fillText('11:12', x + w * 0.1, sy)
  const gx = x + w * 0.71
  for (let i = 0; i < 4; i++) X.fillRect(gx + i * u * 2.2, sy + u * 2 - i * u * 0.9, u * 1.5, u * 1.2 + i * u * 0.9)
  rrect(gx + u * 13, sy - u * 2.2, u * 9, u * 4.4, u * 1.4); X.strokeStyle = X.fillStyle; X.lineWidth = u * 0.5; X.globalAlpha = 0.5; X.stroke(); X.globalAlpha = 1
  rrect(gx + u * 13.8, sy - u * 1.4, u * 6.5, u * 2.8, u * 0.8); X.fill()
}

function device(frame, x, y, w) {
  const rim = w * 0.005, bez = w * 0.032, sw = w - 2 * (rim + bez)
  const sh = sw * SCREEN_RATIO, h = sh + 2 * (rim + bez), r = w * 0.167
  X.save(); X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = w * 0.3; X.shadowOffsetY = w * 0.12
  rrect(x, y, w, h, r); X.fillStyle = '#111'; X.fill(); X.restore()
  const g = X.createLinearGradient(x, y, x + w * 0.6, y + h)
  g.addColorStop(0, '#9a9ba0'); g.addColorStop(0.4, '#4a4b50'); g.addColorStop(0.7, '#6e7075'); g.addColorStop(1, '#3a3b3f')
  rrect(x, y, w, h, r); X.fillStyle = g; X.fill()
  rrect(x + rim, y + rim, w - 2 * rim, h - 2 * rim, r - rim); X.fillStyle = '#000'; X.fill()
  const sx = x + rim + bez, sy = y + rim + bez
  X.save(); rrect(sx, sy, sw, sh, r - rim - bez); X.clip(); screenInto(frame, sx, sy, sw, sh); X.restore()
  const iw = sw * 0.313, ih = sw * 0.092
  rrect(x + w / 2 - iw / 2, sy + sw * 0.027, iw, ih, ih / 2); X.fillStyle = '#000'; X.fill()
  return h
}

function browser(frame, x, y, w, url = '') {
  const bar = w * 0.035, r = w * 0.016, ph = w * (frame.height / frame.width), h = bar + ph
  X.save(); X.shadowColor = 'rgba(0,0,0,0.55)'; X.shadowBlur = w * 0.06; X.shadowOffsetY = w * 0.03
  rrect(x, y, w, h, r); X.fillStyle = '#f3f3f2'; X.fill(); X.restore()
  X.save(); rrect(x, y, w, h, r); X.clip()
  X.fillStyle = '#efeeec'; X.fillRect(x, y, w, bar)
  ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { X.beginPath(); X.arc(x + bar * 0.55 + i * bar * 0.5, y + bar / 2, bar * 0.14, 0, Math.PI * 2); X.fillStyle = c; X.fill() })
  const pw = w * 0.34; rrect(x + w / 2 - pw / 2, y + bar * 0.2, pw, bar * 0.6, bar * 0.3); X.fillStyle = '#e2e1de'; X.fill()
  X.fillStyle = '#6b6a66'; X.font = `500 ${bar * 0.32}px Figtree`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(url, x + w / 2, y + bar / 2); X.textAlign = 'left'
  X.fillStyle = 'rgba(0,0,0,0.08)'; X.fillRect(x, y + bar - 1, w, 1)
  X.drawImage(frame, x, y + bar, w, ph); X.restore()
  return h
}

async function makeBg(cfg) {
  if (!cfg.bgImage) return null
  const im = await img(cfg.bgImage), c = document.createElement('canvas'); c.width = C.width; c.height = C.height
  const x = c.getContext('2d'), s = Math.max(c.width / im.width, c.height / im.height) * 1.08
  x.filter = `blur(${cfg.bgBlur ?? 26}px) brightness(${cfg.bgDim ?? 0.62}) saturate(1.1)`
  x.drawImage(im, (c.width - im.width * s) / 2, (c.height - im.height * s) * (cfg.bgY ?? 0.5), im.width * s, im.height * s)
  x.filter = 'none'
  const g = x.createLinearGradient(0, 0, 0, c.height)
  g.addColorStop(0, 'rgba(10,20,45,0.25)'); g.addColorStop(1, 'rgba(2,6,16,0.55)')
  x.fillStyle = g; x.fillRect(0, 0, c.width, c.height)
  return c
}