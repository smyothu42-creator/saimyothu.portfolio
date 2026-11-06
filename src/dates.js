// 'YYYY-MM' helpers for the experience lists (About and Home).
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Months since year 0, for ordering roles.
export const toMonths = (ym) => {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}

const fmt = (ym) => `${MONTHS[+ym.slice(5) - 1]} ${ym.slice(0, 4)}`

// 'Nov 2025 – Now' / 'Feb 2024 – Jul 2024'
export const range = (start, end) => `${fmt(start)} – ${end ? fmt(end) : 'Now'}`

// Roles, newest first.
export const newestFirst = (roles) => [...roles].sort((a, b) => toMonths(b.start) - toMonths(a.start))
