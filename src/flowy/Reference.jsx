import { useMemo, useState } from 'react'
import './flowy.css'
import { AdminNav, Button, ItemRow, OrderCard, SearchField, Segmented, SelectField } from './components'

const FILTERS = ['All', 'Dine In', 'Takeaway', 'Pick up']

// Orders copied from the admin orders screen. Prices appear only where that
// screen shows them.
const ORDERS = [
  { id: '7', title: '7', when: '1 minute ago', minutes: 1, lines: [{ qty: '1×', name: 'Kyay Oh' }] },
  {
    id: '5', title: '5', when: '3 minutes ago', minutes: 3,
    lines: [
      { qty: '1×', name: 'Iced Americano', price: '5,000 Ks' },
      { qty: '1×', name: 'Black Coffee', price: '9,500 Ks' },
    ],
    bill: [
      ['Sub Total', '14,500 Ks'],
      ['Tax', '0 Ks'],
      ['Service Charge', '0 Ks'],
    ],
    total: '14,500 Ks',
  },
  {
    id: 'R-02', title: 'R-02', when: '3 minutes ago', minutes: 3,
    note: '1h 12m · In use', total: '12,008 Ks',
    lines: [
      { qty: '1×', name: 'Iced Americano' },
      { qty: '1×', name: 'Black Coffee' },
    ],
  },
  { id: '13', title: '13', when: '9 minutes ago', minutes: 9, lines: [{ qty: '1×', name: 'Rakhine Mont Ti' }, { qty: '1×', name: 'Mala Xiang Guo' }] },
  {
    id: 'R-03', title: 'R-03', when: '15 minutes ago', minutes: 15,
    note: '1h 11m · Usage ended', total: '11,833 Ks',
    lines: [
      { qty: '1×', name: 'Lime Jasmine Fizz' },
      { qty: '1×', name: 'Mocha' },
    ],
  },
  { id: '2', title: '2', when: '22 minutes ago', minutes: 22, lines: [{ qty: '1×', name: 'Cinnamon Roll' }] },
  { id: '9', title: '9', when: '26 minutes ago', minutes: 26, lines: [{ qty: '1×', name: 'Latte' }, { qty: '1×', name: 'Croissant' }] },
  { id: '11', title: '11', when: '31 minutes ago', minutes: 31, lines: [{ qty: '1×', name: 'Shan Noodle' }, { qty: '1×', name: 'Cola' }] },
]

const SWATCHES = [
  ['Action', '--fy-color-action', '#ff9e3d'],
  ['Ink', '--fy-color-ink', '#212121'],
  ['Muted', '--fy-color-muted', '#787878'],
  ['Time', '--fy-color-time', '#ff9e3d'],
  ['Danger', '--fy-color-danger', '#cc6c54'],
  ['Surface', '--fy-color-surface', '#ffffff'],
  ['Canvas', '--fy-color-canvas', '#fafafa'],
  ['Panel', '--fy-color-panel', '#f8f5ee'],
]

function Bill({ order }) {
  if (order.bill) {
    return (
      <>
        <div className="fy-bill">
          {order.bill.map(([label, value]) => <div key={label}><span>{label}</span><span>{value}</span></div>)}
        </div>
        <div className="fy-total"><span>TOTAL</span><span>{order.total}</span></div>
      </>
    )
  }
  if (order.total) {
    return <div className="fy-total"><span>TOTAL</span><span>{order.total}</span></div>
  }
  return <p className="fy-missing">Line prices for this order are not on the source screen.</p>
}

function OrdersProof() {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('5')
  const [lang, setLang] = useState('EN')
  const [area, setArea] = useState('orders')
  const [checked, setChecked] = useState({})

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ORDERS.filter((order) => {
      if (!q) return true
      const hay = [order.title, order.when, ...order.lines.map((line) => line.name)].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [query])
  const current = visible.find((order) => order.id === selected) || visible[0] || null

  return (
    <div className="fy-app">
      <AdminNav current={area} onNavigate={setArea} />
      <section className="fy-board" aria-label="Orders">
        <div className="fy-board-bar">
          <h3>Orders</h3>
        </div>
        <div className="fy-tools">
          <Segmented label="Order channel" options={FILTERS} value={filter} onChange={setFilter} />
          <SearchField value={query} onChange={setQuery} placeholder="Search item, table, pickup..." />
          <SelectField label="Newest First" />
        </div>
        {area !== 'orders' ? (
          <div className="fy-grid"><p className="fy-empty">This reference builds the orders screen. The other destinations stay in the admin nav, without invented pages.</p></div>
        ) : filter === 'All' ? (
          <div className="fy-grid">
            {visible.length === 0 && <p className="fy-empty">No orders match that search.</p>}
            {visible.map((order) => (
              <OrderCard key={order.id} order={order} selected={current?.id === order.id} onSelect={() => setSelected(order.id)} />
            ))}
          </div>
        ) : (
          <div className="fy-grid">
            <p className="fy-empty">These cards are not tagged by channel on the source screen, so only All has orders here.</p>
          </div>
        )}
      </section>
      <aside className="fy-panel" aria-label="Order">
        <div className="fy-panel-top">
          <div className="fy-account">
            <span className="fy-avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 19c1.2-2 3-3 6-3s4.8 1 6 3" /></svg>
            </span>
            <div><strong>Demo Owner</strong><small>Demo Café</small></div>
          </div>
          <Button category="outline">Flowy</Button>
          <Segmented label="Language" options={['EN', 'မြန်မာ']} value={lang} onChange={setLang} />
        </div>
        {current && (
          <>
            <div className="fy-panel-body">
              <div className="fy-board-bar">
                <h3>{current.title}</h3>
                <Button category="danger">Cancel Order</Button>
              </div>
              <p className="fy-kicker">Order items</p>
              {current.lines.map((line) => (
                <ItemRow
                  key={line.name}
                  line={line}
                  checked={!!checked[current.id + line.name]}
                  onChange={(on) => setChecked((prev) => ({ ...prev, [current.id + line.name]: on }))}
                />
              ))}
            </div>
            <Bill order={current} />
            <Button category="primary" size="bar">Print Slips</Button>
          </>
        )}
      </aside>
    </div>
  )
}

const POSTER_SWATCHES = [
  ['Action', '--fy-color-action', '#ff9e3d'],
  ['Ink', '--fy-color-ink', '#212121'],
  ['Muted', '--fy-color-muted', '#787878'],
  ['Danger', '--fy-color-danger', '#cc6c54'],
  ['Surface', '--fy-color-surface', '#ffffff'],
  ['Canvas', '--fy-color-canvas', '#fafafa'],
  ['Panel', '--fy-color-panel', '#f8f5ee'],
  ['Line', '--fy-color-line', '#e7e5e1'],
]

function Poster() {
  const order = ORDERS[1]
  return (
    <div className="fy fy-poster">
      <header className="fy-poster-head">
        <div className="fy-poster-brand">
          <img src="/logos/orderflow-icon.png" alt="" />
          <div>
            <h1>Flowy</h1>
            <p>Design system for the OrderFlow admin</p>
          </div>
        </div>
        <p className="fy-kicker fy-poster-kicker">Orders screen tokens</p>
      </header>
      <div className="fy-poster-grid">
        <section className="fy-poster-card">
          <p className="fy-poster-label">Foundations</p>
          <h2>Tokens</h2>
          <div className="fy-poster-swatches">
            {POSTER_SWATCHES.map(([name, token]) => (
              <div key={token}>
                <i style={{ background: `var(${token})` }} />
                <b>{name}</b>
                <span>{token.replace('--fy-color-', '')}</span>
              </div>
            ))}
          </div>
          <div className="fy-poster-type">
            <strong>SF Pro Display</strong>
            <span>The admin UI, labels and order cards.</span>
          </div>
          <div>
            <p className="fy-poster-label">Spacing</p>
            <div className="fy-poster-spaces">
              {[4, 8, 12, 16, 20, 24].map((n) => (
                <div key={n}><i style={{ width: n * 3 }} /><span>{n}</span></div>
              ))}
            </div>
          </div>
          <p className="fy-poster-note">Components use these names. A screen does not reach for a raw hex.</p>
        </section>
        <section className="fy-poster-card">
          <p className="fy-poster-label">Components</p>
          <h2>Built for the orders board</h2>
          <div className="fy-poster-stack">
            <div className="fy-row">
              <Button category="primary">Print Slips</Button>
              <Button category="outline">Flowy</Button>
              <Button category="danger">Cancel Order</Button>
            </div>
            <Segmented label="Order channel" options={FILTERS} value="All" onChange={() => {}} />
            <SearchField value="" onChange={() => {}} placeholder="Search item, table, pickup..." />
            <OrderCard order={order} selected onSelect={() => {}} />
            <ItemRow line={order.lines[0]} checked onChange={() => {}} />
            <ItemRow line={order.lines[1]} checked onChange={() => {}} />
            <div className="fy-row">
              <Button category="primary" disabled>Print Slips</Button>
              <Button category="primary" busy disabled>Printing</Button>
            </div>
            <SearchField value="??" onChange={() => {}} invalid message="Use a table, a room or an item name." />
          </div>
        </section>
        <section className="fy-poster-card">
          <p className="fy-poster-label">Orders</p>
          <h2>One obvious action</h2>
          <OrderCard order={ORDERS[0]} selected={false} onSelect={() => {}} />
          <div className="fy-poster-panel">
            <h3>{order.title}</h3>
            <p className="fy-kicker">Order items</p>
            <ItemRow line={order.lines[0]} checked={false} onChange={() => {}} />
            <ItemRow line={order.lines[1]} checked onChange={() => {}} />
            <div className="fy-bill">
              {order.bill.map(([label, value]) => <div key={label}><span>{label}</span><span>{value}</span></div>)}
            </div>
            <div className="fy-total"><span>TOTAL</span><span>{order.total}</span></div>
            <Button category="primary" size="bar">Print Slips</Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function Reference() {
  const [channel, setChannel] = useState('All')
  const [query, setQuery] = useState('')
  if (new URLSearchParams(window.location.search).get('board') === '1') return <Poster />
  return (
    <div className="fy">
      <div className="fy-docs">
        <aside className="fy-side">
          <p className="fy-brand"><img src="/logos/orderflow-icon.png" alt="" />Flowy</p>
          <nav>
            <a href="#foundations">Foundations</a>
            <a href="#buttons">Buttons</a>
            <a href="#controls">Controls</a>
            <a href="#orders">Orders</a>
            <a href="#proof">Orders screen</a>
          </nav>
        </aside>
        <main className="fy-main">
          <p className="fy-kicker">OrderFlow admin</p>
          <h1>Flowy</h1>
          <p className="fy-lead">
            The design system for the OrderFlow admin. Colour comes from the orders screen.
            Components use semantic tokens, so a screen never reaches for a raw hex.
          </p>

          <section className="fy-section" id="foundations">
            <h2>Foundations</h2>
            <p>Core ramps sit behind these names. Action, time and the print bar are the same sampled orange, #FF9E3D. Danger is the cancel colour, #CC6C54. The order panel is the cream surface.</p>
            <div className="fy-swatches">
              {SWATCHES.map(([name, token, hex]) => (
                <div className="fy-swatch" key={token}>
                  <i style={{ background: `var(${token})`, borderBottom: '1px solid var(--fy-color-line)' }} />
                  <b>{name}</b>
                  <span>{token}</span>
                  <span>{hex}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="fy-section" id="buttons">
            <h2>Buttons</h2>
            <p>Primary is the one obvious action. Outline is a named tool. Danger cancels. Disabled and busy stay visible and do not fire.</p>
            <div className="fy-row">
              <Button category="primary">Print Slips</Button>
              <Button category="outline">Flowy</Button>
              <Button category="danger">Cancel Order</Button>
              <Button category="primary" disabled>Print Slips</Button>
              <Button category="primary" busy disabled>Printing</Button>
            </div>
          </section>

          <section className="fy-section" id="controls">
            <h2>Controls</h2>
            <p>The orders toolbar: channel, search, and sort. An empty search that is only spaces is not an error. A search that finds nothing is an empty board, not a red field.</p>
            <div className="fy-row">
              <Segmented label="Order channel" options={FILTERS} value={channel} onChange={setChannel} />
              <SearchField value={query} onChange={setQuery} placeholder="Search item, table, pickup..." />
              <SelectField label="Newest First" />
            </div>
            <p className="fy-note">Channel is {channel}. Search is {query ? `“${query}”` : 'empty'}.</p>
            <div className="fy-row">
              <SearchField value="??" onChange={() => {}} invalid message="Use a table, a room or an item name." />
            </div>
          </section>

          <section className="fy-section" id="orders">
            <h2>Order cards and rows</h2>
            <p>A card is the table or room, the time, and the lines. A row in the panel adds a check and, when the screen has it, a price.</p>
            <div className="fy-grid" style={{ maxWidth: 720, marginBottom: 16 }}>
              <OrderCard order={ORDERS[0]} selected={false} onSelect={() => {}} />
              <OrderCard order={ORDERS[2]} selected onSelect={() => {}} />
            </div>
            <div className="fy-row" style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 520 }}>
              <ItemRow line={ORDERS[1].lines[0]} checked={false} onChange={() => {}} />
              <ItemRow line={ORDERS[1].lines[1]} checked onChange={() => {}} />
            </div>
          </section>

          <section className="fy-section" id="proof">
            <h2>Orders screen</h2>
            <p>The same components, composed into the admin orders board. The eight cards and table 5’s bill are the ones on the source screen. Other channels have no tagged cards, so they show the empty state instead of a guessed list.</p>
            <OrdersProof />
          </section>
        </main>
      </div>
    </div>
  )
}
