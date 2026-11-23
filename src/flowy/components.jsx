const ICON = {
  orders: 'M4 6h16M4 12h16M4 18h10',
  menus: 'M6 4h12v16H6zM9 8h6M9 12h6',
  stock: 'M4 8l8-4 8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4',
  tables: 'M4 8h16v8H4zM8 16v3M16 16v3',
  customers: 'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 19c1.2-2 3-3 6-3s4.8 1 6 3',
  loyalty: 'M12 19s-6-3.6-6-8a3.4 3.4 0 0 1 6-2 3.4 3.4 0 0 1 6 2c0 4.4-6 8-6 8z',
  feedback: 'M5 6h14v9H8l-3 3z',
  reports: 'M5 19V9M12 19V5M19 19v-7',
  metrics: 'M5 16l4-4 3 3 7-7',
}

function Glyph({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export function Button({ category = 'quiet', size, busy, children, ...rest }) {
  return (
    <button className={'fy-btn is-' + category + (size ? ' is-' + size : '')} aria-busy={busy || undefined} {...rest}>
      {children}
    </button>
  )
}

export function Segmented({ options, value, onChange, label }) {
  return (
    <div className="fy-seg" role="group" aria-label={label}>
      {options.map((opt) => (
        <button key={opt} type="button" aria-pressed={value === opt} onClick={() => onChange(opt)}>{opt}</button>
      ))}
    </div>
  )
}

export function SearchField({ value, onChange, placeholder, invalid, message }) {
  return (
    <div>
      <label className={'fy-field' + (invalid ? ' is-error' : '')}>
        <Glyph d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM16 16l4 4" />
        <input value={value} placeholder={placeholder} aria-invalid={invalid || undefined} onChange={(e) => onChange(e.target.value)} />
      </label>
      {invalid && message && <p className="fy-error">{message}</p>}
    </div>
  )
}

export function SelectField({ label, children }) {
  return (
    <label className="fy-select">
      <select aria-label={label} defaultValue={label}>
        <option>{label}</option>
        {children}
      </select>
    </label>
  )
}

export function OrderCard({ order, selected, onSelect }) {
  return (
    <button type="button" className={'fy-card' + (selected ? ' is-on' : '')} aria-pressed={selected} onClick={onSelect}>
      <span className="fy-card-top">
        <strong>{order.title}</strong>
        <time>{order.when}</time>
      </span>
      {order.note && (
        <span className="fy-room"><span>{order.note}</span>{order.total && <b>{order.total}</b>}</span>
      )}
      <span className="fy-lines">
        {order.lines.map((line) => (
          <span key={line.name}><span>{line.qty}</span>{line.name}</span>
        ))}
      </span>
    </button>
  )
}

export function ItemRow({ line, checked, onChange }) {
  return (
    <label className="fy-item">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <b>{line.qty}</b>
      <span>{line.name}</span>
      {line.price && <span>{line.price}</span>}
    </label>
  )
}

export const NAV = [
  ['orders', 'Orders'],
  ['menus', 'Menus'],
  ['stock', 'Kitchen Stock'],
  ['tables', 'Tables'],
  ['customers', 'Customers'],
  ['loyalty', 'Loyalty'],
  ['feedback', 'Feedback'],
  ['reports', 'Reports'],
  ['metrics', 'Metrics'],
]

export function AdminNav({ current = 'orders', onNavigate }) {
  return (
    <nav className="fy-nav" aria-label="Admin">
      <img src="/logos/orderflow-icon.png" alt="" />
      {NAV.map(([id, label]) => (
        <button key={id} type="button" aria-current={current === id ? 'page' : undefined} onClick={() => onNavigate?.(id)}>
          <Glyph d={ICON[id]} />
          {label}
        </button>
      ))}
    </nav>
  )
}
