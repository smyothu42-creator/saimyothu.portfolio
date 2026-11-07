// Fictional API for capturing the real OrderFlow admin UI (no live data, no login).
// usage: node mock-of-api.mjs   then run the admin with DEV_API_TARGET=http://127.0.0.1:3012
import http from 'node:http'
import fs from 'node:fs'
const ORG = 'org-demo', now = Date.now(), ago = (m) => new Date(now - m * 60000).toISOString()
const user = { id: 'u1', name: 'Demo Owner', email: 'demo@orderflow.example', emailVerified: true, image: null, createdAt: ago(9999), updatedAt: ago(9999) }
const organization = { id: ORG, name: 'Demo Café', slug: 'demo-cafe', logo: null, metadata: { staffTableCount: 14 }, currency: 'MMK', createdAt: ago(9999) }
const CATS = [['c1', 'Coffee'], ['c2', 'Main Meals'], ['c3', 'Soda & Cans'], ['c4', 'Bread']]
const MENU = [['Iced Americano', 5000, 'c1'], ['Black Coffee', 9500, 'c1'], ['Lime Jasmine Fizz', 14000, 'c1'], ['Latte', 7000, 'c1'], ['Iced Latte', 7000, 'c1'], ['Iced Matcha Latte', 8000, 'c1'],
  ['Mala Xiang Guo', 16000, 'c2'], ['Rakhine Mont Ti', 6000, 'c2'], ['Kyay Oh', 7500, 'c2'], ['Shan Noodle', 6500, 'c2'], ['Fried Rice', 8000, 'c2'], ['Tea Leaf Salad', 5500, 'c2'],
  ['Cola', 2500, 'c3'], ['Soda Water', 2000, 'c3'], ['Cinnamon Roll', 4500, 'c4'], ['Butter Toast', 3500, 'c4'], ['Croissant', 5000, 'c4']]
const NEW_IMG = 'http://127.0.0.1:3012/__img/espresso.jpg'
const IMG = { 'Iced Americano': 'https://staging.productimage.orderflowmm.com/development/f7bf60e1-ffab-4370-96bb-984f080ca7a5/products/2026/06/19/b327267b-828c-4c4e-9dd8-9e423259fe8d-iced-americano-1.webp', 'Black Coffee': 'https://staging.productimage.orderflowmm.com/development/f7bf60e1-ffab-4370-96bb-984f080ca7a5/products/2026/06/19/0ead0f99-e989-4d13-87d5-f8d83f6b9241-blackcoffee-1.webp', 'Lime Jasmine Fizz': 'https://staging.productimage.orderflowmm.com/development/f7bf60e1-ffab-4370-96bb-984f080ca7a5/products/2026/06/19/33315d24-ba95-490f-b5c2-d5161833670e-lime-jasmine-fizz-1.webp', 'Latte': 'https://staging.productimage.orderflowmm.com/development/f7bf60e1-ffab-4370-96bb-984f080ca7a5/products/2026/06/19/8142535e-545a-4eb3-b418-a1f829b6d5e2-latte-1.webp', 'Iced Latte': 'https://staging.productimage.orderflowmm.com/development/f7bf60e1-ffab-4370-96bb-984f080ca7a5/products/2026/06/19/128b8538-6060-4cb3-a770-b3238965e626-iced-latte.webp', 'Iced Matcha Latte': 'https://staging.productimage.orderflowmm.com/development/f7bf60e1-ffab-4370-96bb-984f080ca7a5/products/2026/06/19/6a029818-2819-4ad6-acf5-18920f949141-matcha-1.webp' }
const products = MENU.map(([name, p, categoryId], i) => ({ id: 'p' + i, name, nameMm: null, basePrice: String(p), takeawayPrice: null, promoPrice: null, imageUrl: IMG[name] ?? null, categoryName: CATS.find((c) => c[0] === categoryId)[1], isActive: true, categoryId, displayOrder: i, modifiers: [], status: 'active' }))
const price = (n) => MENU.find((m) => m[0] === n)[1]
let itemSeq = 0
const item = (n, q = 1, i = 0) => ({ id: 'it' + ++itemSeq, productId: 'p' + MENU.findIndex((m) => m[0] === n), quantity: q, basePrice: String(price(n)), subtotalAmount: String(price(n) * q), metadata: { productName: n, displayName: n }, activeQuantity: q, cancelledQuantity: 0 })
let seq = 100
const order = (names, m, extra = {}) => { const items = names.map((n, i) => item(n, 1, i)); const total = items.reduce((s, x) => s + +x.subtotalAmount, 0); return { id: 'o' + ++seq, orderNumber: 'ORD-' + seq, status: 'pending', paymentStatus: 'unpaid', contextType: 'dine_in', subtotalAmount: String(total), taxAmount: '0', serviceChargeAmount: '0', totalAmount: String(total), itemCount: items.length, createdAt: ago(m), updatedAt: ago(m), items, ...extra } }
const table = (d, names, m, extra = {}) => ({ id: 's' + d, code: 'S-' + d, status: 'active', startedAt: ago(m), serviceType: 'dine_in', table: { id: 't' + d, displayId: d, floorId: 'f1', floorName: 'Main Floor', type: 'table' }, orders: [order(names, m, extra)] })
const room = (d, names, m, rate = 10000) => ({ id: 's' + d, code: 'S-' + d, status: 'active', startedAt: ago(72), serviceType: 'dine_in', table: { id: 't' + d, displayId: d, floorId: 'f1', floorName: 'Main Floor', type: 'room' }, room: { billingStatus: 'running', hourlyRateAmount: String(rate), usageStartedAt: ago(72), usageEndedAt: null, durationSeconds: null }, orders: [order(names, m)] })
const frozen = room('R-03', ['Lime Jasmine Fizz', 'Iced Matcha Latte'], 15)
frozen.room = { ...frozen.room, billingStatus: 'frozen', usageEndedAt: ago(1), durationSeconds: 4320, roomFeeAmount: '12000' }
let sessions = [table('5', ['Iced Americano', 'Black Coffee'], 3), room('R-02', ['Iced Americano', 'Black Coffee'], 3), table('7', ['Kyay Oh'], 1), table('13', ['Rakhine Mont Ti', 'Mala Xiang Guo'], 9), frozen, table('2', ['Cinnamon Roll'], 22), table('9', ['Latte', 'Croissant'], 26), table('11', ['Shan Noodle', 'Cola'], 31)]
const tables = [...Array(14).keys()].map((i) => String(i + 1))
const positions = [...tables.map((d, i) => ({ tableId: 't' + d, tableDisplayId: d, status: true, x: 60 + (i % 5) * 190, y: 60 + Math.floor(i / 5) * 190, size: 'medium', type: 'table', updatedAt: ago(999) })), ...['R-01', 'R-02', 'R-03'].map((d, i) => ({ tableId: 't' + d, tableDisplayId: d, status: true, x: 60 + i * 260, y: 640, size: 'large', type: 'room', updatedAt: ago(999) }))]
const floor = { id: 'f1', name: 'Main Floor', displayOrder: 0, isDefault: true, layoutRevision: 1, createdAt: ago(999), updatedAt: ago(999) }
const rooms = ['R-01', 'R-02', 'R-03'].map((d) => { const s = sessions.find((x) => x.table.displayId === d); return { roomId: 't' + d, displayId: d, status: s ? (s.room.billingStatus === 'frozen' ? 'frozen' : 'occupied') : 'available', sessionId: s?.id ?? null, usageStartedAt: s ? ago(72) : null, hourlyRateAmount: '10000', orderCount: s ? 1 : 0, foodTotalAmount: s ? s.orders[0].totalAmount : '0' } })
const routes = [
  [/auth\/get-session/, () => ({ user, session: { id: 'sess', userId: 'u1', token: 'demo', expiresAt: new Date(now + 864e5).toISOString(), activeOrganizationId: ORG } }), true],
  [/private\/users\/me/, () => ({ user, organization, organizations: [organization], organizationRole: 'owner', role: 'owner', member: { role: 'owner' }, permissions: ['orders:read', 'orders:create', 'orders:update', 'orders:delete'] })],
  // Changes the recordings make stick, so a refetch shows them: items marked ready, a paid order
  // leaving the board once served, and a manual order landing on its table.
  [/private\/orders\/([^/]+)\/items\/([^/]+)\/ready/, (u) => { const iid = decodeURIComponent(u.match(/items\/([^/?]+)/)[1]); for (const ss of sessions) for (const o of ss.orders) for (const it of o.items) if (it.id === iid) it.readyAt = it.readyAt ? null : new Date().toISOString(); return {} }],
  [/private\/orders\/([^/]+)\/payment-status/, (u, body) => { const oid = u.match(/orders\/([^/]+)\/payment-status/)[1]; if (body.paymentStatus !== 'paid') return {}; const ss = sessions.find((x) => x.orders.some((o) => o.id === oid)); if (!ss) return {}; for (const o of ss.orders) if (o.id === oid) o.paymentStatus = 'paid'; if (ss.orders.every((o) => o.items.every((it) => it.readyAt))) sessions = sessions.filter((x) => x !== ss); return {} }],
  [/private\/orders\/manual(\?|$)/, (u, body) => { const names = (body.items || []).flatMap((i) => Array(i.quantity || 1).fill(products.find((p) => p.id === i.productId)?.name).filter(Boolean)); const ss = table(body.tableLabel || 'T', names, 0); ss.orders[0].contextType = body.contextType || 'manual'; sessions = [ss, ...sessions.filter((x) => x.table.displayId !== ss.table.displayId)]; const o = ss.orders[0]; return { order: { ...o, tableLabel: body.tableLabel ?? null, itemCount: o.items.length, createdAt: new Date().toISOString() } } }],
  [/private\/orders\/table-sessions/, () => ({ lastSeenEventSeq: 1, sessions })],
  [/private\/orders\/manual\/rooms/, () => ({ rooms })],
  [/private\/orders\/manual\/quote/, (u, body) => { const items = (body.items || []).map((i) => { const p = products.find((x) => x.id === i.productId); const sub = +p.basePrice * i.quantity; return { productId: i.productId, quantity: i.quantity, isTakeaway: !!i.isTakeaway, basePrice: p.basePrice, subtotalAmount: String(sub), modifiers: [] } }); const t = items.reduce((a2, x) => a2 + +x.subtotalAmount, 0); return { quote: { quoteHash: 'demo', items, subtotalAmount: String(t), taxRatePercent: '0', taxAmount: '0', serviceChargePercent: '0', serviceChargeAmount: '0', totalAmount: String(t), itemCount: items.reduce((a2, x) => a2 + x.quantity, 0) } } }],
  [/private\/orders\/sessions\/([^/]+)\/bill/, (u) => { const id = u.match(/sessions\/([^/]+)\/bill/)[1], s = sessions.find((x) => x.id === id) || sessions[0], food = s.orders.reduce((a, o) => a + +o.totalAmount, 0), fee = s.room ? 12000 : 0; return { sessionId: s.id, sessionStatus: 'active', table: s.table, guests: [{ guestId: 'g1', guestName: 'Guest', batches: s.orders.map((o) => ({ orderId: o.id, totalAmount: o.totalAmount, createdAt: o.createdAt, paymentStatus: 'unpaid', fulfillmentStatus: 'pending', itemCount: o.itemCount })), unpaidTotal: String(food), paidTotal: '0', total: String(food) }], tableTotal: String(food), tableUnpaidTotal: String(food), tablePaidTotal: '0', roomFeeTotal: String(fee), finalTotal: String(food + fee), room: s.room ?? null } }],
  [/private\/orders\/payment-requests|payment-requests/, () => ({ requests: [] })],
  [/private\/tables\/layout\/floors/, () => ({ floors: [floor] })],
  [/private\/tables\/layout/, () => ({ floor, revision: 1, positions })],
  // Feature pages for the case study (loyalty, reports, metrics, menu). A `404` route
  // makes the admin fall back to its own dev sample data.
  [/points-program\/stats|reports\/items|private\/feedback|orders\/realtime/, () => 404],
  [/private\/products\/promo-prices/, () => ({ items: [{ productId: 'p3', promoPrice: 6000, promoStartsAt: null, promoEndsAt: null }], page: 1, pageSize: 100, total: 1 })],
  [/private\/products\/stock/, () => ({ lowStockThreshold: 5, items: [{ productId: 'p14', quantity: 3, isLowStock: true }, { productId: 'p16', quantity: 12 }] })],
  // A new menu item (multipart form): added at the top of its category, with the photo the recording uploads.
  [/private\/products(\?|$)/, (u, body) => { if (body.method !== 'POST') return { products, pagination: { page: 1, limit: 200, total: products.length, totalPages: 1 } }; const f = (k) => (body.raw || '').match(new RegExp('name="' + k + '"\\r\\n\\r\\n([^\\r]*)'))?.[1]; const p = { id: 'p' + products.length, name: f('name') || 'New item', nameMm: f('nameMm') || null, basePrice: f('basePrice') || '0', takeawayPrice: null, promoPrice: null, imageUrl: NEW_IMG, categoryId: f('categoryId') || 'c1', categoryName: 'Coffee', isActive: true, displayOrder: -1, modifiers: [], status: 'active' }; products.unshift(p); return p }],
  [/stamp-program\/stats/, () => ({ cardsCompleted: 46, rewardsRedeemed: 39, activeCardholders: 212 })],
  [/membership\/stats/, () => ({ levels: [['none', 180, 0], ['bronze', 96, 14], ['silver', 41, 6], ['gold', 12, 0]].map(([tier, members, closeToNext]) => ({ tier, members, closeToNext })) })],
  [/private\/product-categories\/([^/?]+)/, (u) => { const id = u.match(/product-categories\/([^/?]+)/)[1], c = CATS.find((x) => x[0] === id) || CATS[0]; return { category: { id: c[0], name: c[1], nameMm: null, parentId: null, displayOrder: CATS.indexOf(c), products: products.filter((p) => p.categoryId === c[0]) } } }],
  [/private\/loyalty\/points-program/, () => ({ enabled: true, kyatPerPoint: 1000, expiryMonths: 12, minRedeemPoints: 50 })],
  [/private\/loyalty\/stamp-program/, () => ({ enabled: true, stampsRequired: 8, spendPerStamp: 5000, maxStampsPerOrder: 2, cardValidityDays: 90, rewardProductIds: ['p0', 'p3'], activeFrom: null, activeTo: null })],
  [/private\/loyalty\/rewards/, () => ({ items: [['p0', 60], ['p3', 80], ['p14', 50], ['p6', 150]].map(([productId, pointsCost], i) => ({ id: 'rw' + i, productId, pointsCost, isActive: true, displayOrder: i })), page: 1, pageSize: 20, total: 4 })],
  [/private\/loyalty\/redemptions/, () => ({ items: [['Aye Chan', 'Iced Americano', 60, 12], ['Thiri Win', 'Latte', 80, 48], ['Ko Zaw', 'Cinnamon Roll', 50, 130]].map(([name, r, pts, m], i) => ({ id: 'rd' + i, customer: { id: 'cu' + i, name, email: null, photoUrl: null }, lines: [{ kind: 'points', rewardName: r, qty: 1, points: pts }], totalPoints: pts, totalStampCredits: 0, createdAt: ago(m) })), page: 1, pageSize: 20, total: 3 })],
  [/private\/loyalty\/membership/, () => ({ enabled: true, periodMonths: 12, criteriaMode: 'any', tiers: [['bronze', 'Bronze', 5, 100000], ['silver', 'Silver', 15, 300000], ['gold', 'Gold', 30, 800000]].map(([id, name, v, sp], i) => ({ id, name, visitsRequired: v, spendRequired: sp, pointsRequired: 0, benefits: [{ id: 'b' + i, kind: 'discount', title: (i + 1) * 5 + '% off', detail: 'On every order', productId: null, discountPercent: (i + 1) * 5, bonusPoints: null, usageLimit: null }] })) })],
  [/private\/dashboard\/overview/, () => ({ summary: { totalSales: '1284000', totalOrders: 142, activeOrders: 9, avgOrderValue: '9042' },
    ordersPerHour: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((h, i) => ({ hour: h, label: (h % 12 || 12) + (h < 12 ? ' AM' : ' PM'), count: [3, 9, 14, 11, 8, 16, 18, 10, 7, 9, 12, 15, 7, 3][i] })),
    revenueTrend: [...Array(7).keys()].map((i) => { const d = new Date(now - (6 - i) * 864e5); return { date: d.toISOString().slice(0, 10), label: d.toLocaleDateString('en-GB', { weekday: 'short' }), revenue: String([980, 1120, 1040, 1310, 1460, 1720, 1284][i] * 1000) } }),
    topItems: [['p0', 'Iced Americano', 48], ['p3', 'Latte', 36], ['p6', 'Mala Xiang Guo', 22], ['p14', 'Cinnamon Roll', 19], ['p2', 'Lime Jasmine Fizz', 17]].map(([productId, name, quantity]) => ({ productId, name, quantity })),
    comboSuggestions: [{ primaryProductId: 'p0', primaryName: 'Iced Americano', secondaryProductId: 'p14', secondaryName: 'Cinnamon Roll', supportCount: 21, confidence: 0.44, estimatedWeeklyUpsell: '94500' }, { primaryProductId: 'p6', primaryName: 'Mala Xiang Guo', secondaryProductId: 'p12', secondaryName: 'Cola', supportCount: 14, confidence: 0.38, estimatedWeeklyUpsell: '35000' }] })],
  [/private\/reports\/daily-close/, () => { const br = (g, t) => ({ grossSales: String(g), ticketCount: t, averageTicket: String(Math.round(g / t)), discountAmount: '0', serviceChargeAmount: '0', taxAmount: '0', roomRevenue: '0', refundedCount: 0, refundedAmount: '0', total: String(g) })
    return { date: new Date(now).toISOString().slice(0, 10), timezone: 'Asia/Yangon', shift: { startTime: '00:00', endTime: '00:00', periodStart: ago(600), periodEnd: ago(-840) },
      sales: { ...br(1284000, 142), discountAmount: '18000', roomRevenue: '36000', cancelledCount: 2, cancelledAmount: '14500' },
      channels: [{ channel: 'dine_in', ...br(902000, 98) }, { channel: 'takeaway', ...br(248000, 29) }, { channel: 'pickup', ...br(134000, 15) }],
      ticketPromotions: [{ name: 'Discount', tickets: 4, amount: '18000' }], payments: [{ method: 'Cash', tickets: 71, amount: '612000' }, { method: 'KBZPay', tickets: 58, amount: '533000' }, { method: 'AYA Pay', tickets: 13, amount: '139000' }],
      netSales: '1266000', orderCount: 142, totalDiscounts: '18000', roomRevenue: '36000', byMethod: [], cancelledCount: 2 } }],
  [/private\/reports(\?|$)/, () => { const rows = [['Iced Americano, Cinnamon Roll', 9500, 'dine_in', '5', 4], ['Latte x2', 14000, 'takeaway', '-', 11], ['Mala Xiang Guo, Cola', 18500, 'dine_in', '13', 18], ['Shan Noodle, Lime Jasmine Fizz', 20500, 'pickup', '-', 26], ['Kyay Oh', 7500, 'dine_in', '7', 33], ['Black Coffee, Croissant', 14500, 'dine_in', '2', 41], ['Tea Leaf Salad, Fried Rice', 13500, 'dine_in', '9', 52], ['Iced Latte x3', 21000, 'takeaway', '-', 64]].map(([items, t, type, tbl, m], i) => ({ orderId: 'r' + i, orderNumber: 'ORD-' + (240 - i), paymentStatus: 'paid', createdAt: ago(m), orderType: type, tableNumber: tbl, itemCount: items.split(',').length, orderItems: items, totalAmount: String(t) }))
    return { rows, summary: { totalOrders: 142, totalRevenue: '1284000', totalDiscounts: '18000', roomRevenue: '36000', revenueByChannel: [{ channel: 'dine_in', orders: 98, revenue: '902000', discounts: '12000' }, { channel: 'takeaway', orders: 29, revenue: '248000', discounts: '6000' }, { channel: 'pickup', orders: 15, revenue: '134000', discounts: '0' }] }, pagination: { page: 1, limit: 20, total: 142, totalPages: 8 } } }],
  [/private\/products\/menu/, () => ({ products })],
  [/private\/product-categories/, () => ({ categories: CATS.map(([id, name], i) => ({ id, name, nameMm: null, parentId: null, displayOrder: i })) })],
  [/private\/organizations\/[^/?]+$/, () => ({ organization, ...organization })],
]
http.createServer((q, r) => {
  let raw = ''
  q.on('data', (c) => { raw += c })
  q.on('end', () => {
    if (q.method !== 'GET') console.log(q.method, q.url, raw.slice(0, 600).replace(/[^\x20-\x7e]+/g, ' '))
    if (q.url.startsWith('/__img/')) { r.setHeader('content-type', 'image/jpeg'); r.end(fs.readFileSync(new URL('./assets-of/' + q.url.slice(7), import.meta.url))); return }
    const hit = routes.find(([re]) => re.test(q.url))
    r.setHeader('content-type', 'application/json')
    if (!hit) { console.log('MISS', q.method, q.url); r.end(JSON.stringify({ success: true, data: {} })); return }
    let body = {}
    try { body = JSON.parse(raw || '{}') } catch { body = { raw } }
    body.method = q.method
    const data = hit[1](q.url, body)
    if (data === 404) { r.statusCode = 404; r.end('{}'); return }
    r.end(JSON.stringify(hit[2] ? data : { success: true, data }))
  })
}).listen(3012, '127.0.0.1', () => console.log('mock ready'))
