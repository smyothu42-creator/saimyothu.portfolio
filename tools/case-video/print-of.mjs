// The two slips in OrderFlow's cover film (hero-of.html), rendered with the admin's own receipt
// template (styles and markup from orderflow-admin-panel src/lib/orders/receipt-print.ts) for
// the order open on the film's board: Demo Café, table 5, ORD-1, Iced Americano and Black
// Coffee, 14,500 Ks. Writes hero-of/p-bill.jpg and hero-of/p-kitchen.jpg.
// usage: node print-of.mjs
import fs from 'node:fs'
import { launch } from './lib.mjs'

const STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; padding: 2mm; color: #000; font-weight: bold; background: #fff; }
  .shop { text-align: center; font-size: 15px; font-weight: 700; }
  .code { font-size: 26px; font-weight: 700; text-align: center; letter-spacing: 1px; }
  .code-small { font-size: 16px; font-weight: 700; text-align: center; letter-spacing: 1px; }
  .tag { text-align: center; font-weight: 700; letter-spacing: 2px; margin-bottom: 2px; }
  .meta { text-align: center; margin-top: 4px; }
  .divider { border-top: 1px dashed #000; margin: 6px 0; }
  .line { margin-bottom: 6px; }
  .line-row { display: flex; justify-content: space-between; gap: 8px; }
  .line-name { font-weight: 700; } .line-qty { white-space: nowrap; font-weight: 700; } .line-amount { white-space: nowrap; }
  .line-unit { padding-left: 10px; font-size: 11px; }
  .sum-row { display: flex; justify-content: space-between; gap: 8px; }
  .total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 14px; margin-top: 2px; }
  .footer { text-align: center; margin-top: 6px; font-size: 11px; }`
const meta = `<div class="meta">Dine In &middot; Table 5<br />11/8/2026, 11:42:08 AM<br />Cashier: Demo Owner</div>`
const items = [['Iced Americano', 5000], ['Black Coffee', 9500]]
const ks = (n) => n.toLocaleString('en-US') + ' Ks'
const kitchen = `<div class="tag">KITCHEN</div><div class="code">ORD-1</div>${meta}<div class="divider"></div>
  ${items.map(([n]) => `<div class="line"><div class="line-row"><span class="line-name">${n}</span><span class="line-qty">x1</span></div></div>`).join('')}
  <div class="divider"></div><div class="footer">** Please prepare this order **</div>`
const bill = `<div class="shop">Demo Café</div><div class="divider"></div><div class="code-small">ORD-1</div>${meta}<div class="divider"></div>
  ${items.map(([n, p]) => `<div class="line"><div class="line-row"><span class="line-name">${n}</span><span class="line-amount">${ks(p)}</span></div><div class="line-unit">1 @ ${ks(p)}</div></div>`).join('')}
  <div class="divider"></div><div class="sum-row"><span>Items</span><span>2</span></div><div class="sum-row"><span>Subtotal</span><span>${ks(14500)}</span></div>
  <div class="total-row"><span>TOTAL</span><span>${ks(14500)}</span></div><div class="footer">Thank you!</div>`

{
  const { browser, page } = await launch(400, 800, 3)
  for (const [name, body] of [['kitchen', kitchen], ['bill', bill]]) {
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${STYLES}</style></head><body>${body}</body></html>`)
    const el = await page.$('body'); await el.screenshot({ path: `hero-of/p-${name}.jpg`, type: 'jpeg', quality: 92 })
  }
  await browser.close()
}
