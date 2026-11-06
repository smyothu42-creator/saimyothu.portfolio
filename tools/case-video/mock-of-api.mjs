// Fictional API for capturing the real OrderFlow admin UI (no live data, no login).
// usage: node mock-of-api.mjs   then run the admin with DEV_API_TARGET=http://127.0.0.1:3012
import http from 'node:http'
const ORG = 'org-demo', now = Date.now(), ago = (m) => new Date(now - m * 60000).toISOString()
const user = { id: 'u1', name: 'Demo Owner', email: 'demo@orderflow.example', emailVerified: true, image: null, createdAt: ago(9999), updatedAt: ago(9999) }
const organization = { id: ORG, name: 'Demo Café', slug: 'demo-cafe', logo: null, metadata: { staffTableCount: 14 }, currency: 'MMK', createdAt: ago(9999) }
const CATS = [['c1', 'Coffee'], ['c2', 'Main Meals'], ['c3', 'Soda & Cans'], ['c4', 'Bread']]
const MENU = [['Iced Americano', 5000, 'c1'], ['Black Coffee', 9500, 'c1'], ['Lime Jasmine Fizz', 14000, 'c1'], ['Latte', 7000, 'c1'], ['Cappuccino', 7000, 'c1'], ['Mocha', 8000, 'c1'],
  ['Mala Xiang Guo', 16000, 'c2'], ['Rakhine Mont Ti', 6000, 'c2'], ['Kyay Oh', 7500, 'c2'], ['Shan Noodle', 6500, 'c2'], ['Fried Rice', 8000, 'c2'], ['Tea Leaf Salad', 5500, 'c2'],
  ['Cola', 2500, 'c3'], ['Soda Water', 2000, 'c3'], ['Cinnamon Roll', 4500, 'c4'], ['Butter Toast', 3500, 'c4'], ['Croissant', 5000, 'c4']]
const products = MENU.map(([name, p, categoryId], i) => ({ id: 'p' + i, name, nameMm: null, basePrice: String(p), takeawayPrice: null, promoPrice: null, imageUrl: null, categoryId, displayOrder: i, modifiers: [], status: 'active' }))
const price = (n) => MENU.find((m) => m[0] === n)[1]
const item = (n, q = 1, i = 0) => ({ id: 'i' + n + i, productId: 'p' + MENU.findIndex((m) => m[0] === n), quantity: q, basePrice: String(price(n)), subtotalAmount: String(price(n) * q), metadata: { productName: n, displayName: n }, activeQuantity: q, cancelledQuantity: 0 })
let seq = 100
const order = (names, m, extra = {}) => { const items = names.map((n, i) => item(n, 1, i)); const total = items.reduce((s, x) => s + +x.subtotalAmount, 0); return { id: 'o' + ++seq, orderNumber: 'ORD-' + seq, status: 'pending', paymentStatus: 'unpaid', contextType: 'dine_in', subtotalAmount: String(total), taxAmount: '0', serviceChargeAmount: '0', totalAmount: String(total), itemCount: items.length, createdAt: ago(m), updatedAt: ago(m), items, ...extra } }
const table = (d, names, m, extra = {}) => ({ id: 's' + d, code: 'S-' + d, status: 'active', startedAt: ago(m), serviceType: 'dine_in', table: { id: 't' + d, displayId: d, floorId: 'f1', floorName: 'Main Floor', type: 'table' }, orders: [order(names, m, extra)] })
const room = (d, names, m, rate = 10000) => ({ id: 's' + d, code: 'S-' + d, status: 'active', startedAt: ago(72), serviceType: 'dine_in', table: { id: 't' + d, displayId: d, floorId: 'f1', floorName: 'Main Floor', type: 'room' }, room: { billingStatus: 'running', hourlyRateAmount: String(rate), usageStartedAt: ago(72), usageEndedAt: null, durationSeconds: null }, orders: [order(names, m)] })
const frozen = room('R-03', ['Lime Jasmine Fizz', 'Mocha'], 15)
frozen.room = { ...frozen.room, billingStatus: 'frozen', usageEndedAt: ago(1), durationSeconds: 4320, roomFeeAmount: '12000' }
const sessions = [table('5', ['Iced Americano', 'Black Coffee'], 3), room('R-02', ['Iced Americano', 'Black Coffee'], 3), table('7', ['Kyay Oh'], 1), table('13', ['Rakhine Mont Ti', 'Mala Xiang Guo'], 9), frozen, table('2', ['Cinnamon Roll'], 22), table('9', ['Latte', 'Croissant'], 26), table('11', ['Shan Noodle', 'Cola'], 31)]
const tables = [...Array(14).keys()].map((i) => String(i + 1))
const positions = [...tables.map((d, i) => ({ tableId: 't' + d, tableDisplayId: d, status: true, x: 60 + (i % 5) * 190, y: 60 + Math.floor(i / 5) * 190, size: 'medium', type: 'table', updatedAt: ago(999) })), ...['R-01', 'R-02', 'R-03'].map((d, i) => ({ tableId: 't' + d, tableDisplayId: d, status: true, x: 60 + i * 260, y: 640, size: 'large', type: 'room', updatedAt: ago(999) }))]
const floor = { id: 'f1', name: 'Main Floor', displayOrder: 0, isDefault: true, layoutRevision: 1, createdAt: ago(999), updatedAt: ago(999) }
const rooms = ['R-01', 'R-02', 'R-03'].map((d) => { const s = sessions.find((x) => x.table.displayId === d); return { roomId: 't' + d, displayId: d, status: s ? (s.room.billingStatus === 'frozen' ? 'frozen' : 'occupied') : 'available', sessionId: s?.id ?? null, usageStartedAt: s ? ago(72) : null, hourlyRateAmount: '10000', orderCount: s ? 1 : 0, foodTotalAmount: s ? s.orders[0].totalAmount : '0' } })
const routes = [
  [/auth\/get-session/, () => ({ user, session: { id: 'sess', userId: 'u1', token: 'demo', expiresAt: new Date(now + 864e5).toISOString(), activeOrganizationId: ORG } }), true],
  [/private\/users\/me/, () => ({ user, organization, organizations: [organization], organizationRole: 'owner', role: 'owner', member: { role: 'owner' }, permissions: ['orders:read', 'orders:create', 'orders:update', 'orders:delete'] })],
  [/private\/orders\/table-sessions/, () => ({ lastSeenEventSeq: 1, sessions })],
  [/private\/orders\/manual\/rooms/, () => ({ rooms })],
  [/private\/orders\/manual\/quote/, (u, body) => { const items = (body.items || []).map((i) => { const p = products.find((x) => x.id === i.productId); const sub = +p.basePrice * i.quantity; return { productId: i.productId, quantity: i.quantity, isTakeaway: !!i.isTakeaway, basePrice: p.basePrice, subtotalAmount: String(sub), modifiers: [] } }); const t = items.reduce((a2, x) => a2 + +x.subtotalAmount, 0); return { quote: { quoteHash: 'demo', items, subtotalAmount: String(t), taxRatePercent: '0', taxAmount: '0', serviceChargePercent: '0', serviceChargeAmount: '0', totalAmount: String(t), itemCount: items.reduce((a2, x) => a2 + x.quantity, 0) } } }],
  [/private\/orders\/sessions\/([^/]+)\/bill/, (u) => { const id = u.match(/sessions\/([^/]+)\/bill/)[1], s = sessions.find((x) => x.id === id) || sessions[0], food = s.orders.reduce((a, o) => a + +o.totalAmount, 0), fee = s.room ? 12000 : 0; return { sessionId: s.id, sessionStatus: 'active', table: s.table, guests: [{ guestId: 'g1', guestName: 'Guest', batches: s.orders.map((o) => ({ orderId: o.id, totalAmount: o.totalAmount, createdAt: o.createdAt, paymentStatus: 'unpaid', fulfillmentStatus: 'pending', itemCount: o.itemCount })), unpaidTotal: String(food), paidTotal: '0', total: String(food) }], tableTotal: String(food), tableUnpaidTotal: String(food), tablePaidTotal: '0', roomFeeTotal: String(fee), finalTotal: String(food + fee), room: s.room ?? null } }],
  [/private\/orders\/payment-requests|payment-requests/, () => ({ requests: [] })],
  [/private\/tables\/layout\/floors/, () => ({ floors: [floor] })],
  [/private\/tables\/layout/, () => ({ floor, revision: 1, positions })],
  [/private\/products\/menu/, () => ({ products })],
  [/private\/product-categories/, () => ({ categories: CATS.map(([id, name], i) => ({ id, name, nameMm: null, parentId: null, displayOrder: i })) })],
  [/private\/organizations\/[^/?]+$/, () => ({ organization, ...organization })],
]
http.createServer((q, r) => {
  let raw = ''
  q.on('data', (c) => { raw += c })
  q.on('end', () => {
    const hit = routes.find(([re]) => re.test(q.url))
    r.setHeader('content-type', 'application/json')
    if (!hit) { console.log('MISS', q.method, q.url); r.end(JSON.stringify({ success: true, data: {} })); return }
    let body = {}
    try { body = JSON.parse(raw || '{}') } catch { /* no body */ }
    const data = hit[1](q.url, body)
    r.end(JSON.stringify(hit[2] ? data : { success: true, data }))
  })
}).listen(3012, '127.0.0.1', () => console.log('mock ready'))
