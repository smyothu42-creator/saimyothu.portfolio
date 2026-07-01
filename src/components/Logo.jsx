// Brand mark — a signature-style wordmark ("SaiThu.") set in a brush script.
// Inherits currentColor so the topnav's mix-blend-mode difference keeps it
// readable against both light and dark sections.
export default function Logo({ className, ref }) {
  return <span className={className} ref={ref}>Saimt.</span>
}
