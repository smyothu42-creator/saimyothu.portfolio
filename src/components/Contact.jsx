import { EMAIL, NAV } from '../data'

// Fixed reveal footer — the content layer scrolls up to uncover it.
export default function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="footer-inner">
        <a className="footer-chat" href={`mailto:${EMAIL}`}>Let's Chat</a>

        <div className="footer-bottom">
          <nav className="footer-nav">
            {NAV.map((item) => (
              <a key={item.href} className="footer-nav-link" href={item.href}>{item.label}</a>
            ))}
          </nav>
          <div className="footer-icons">
            <a className="footer-ico" href="#" aria-label="LinkedIn" data-magnetic>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3V9zm6 0h3.8v1.64h.05c.53-1 1.82-2.06 3.75-2.06 4.01 0 4.75 2.64 4.75 6.07V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9z"/>
              </svg>
            </a>
            <a className="footer-ico" href="#" aria-label="Video call" data-magnetic>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="6" width="14" height="12" rx="2" />
                <path d="M16 10l6-3v10l-6-3" />
              </svg>
            </a>
            <a className="footer-ico" href="#" aria-label="WhatsApp" data-magnetic>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.8c2.17 0 4.21.85 5.74 2.38a8.06 8.06 0 0 1 2.38 5.73c0 4.48-3.65 8.12-8.12 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.06 8.06 0 0 1-1.24-4.3c0-4.47 3.64-8.11 8.12-8.11zm-2.78 4.4c-.13 0-.34.05-.52.25-.18.2-.69.67-.69 1.64s.71 1.9.81 2.04c.1.13 1.39 2.12 3.37 2.97 1.65.71 1.98.57 2.34.54.36-.03 1.16-.47 1.32-.93.16-.46.16-.85.11-.93-.05-.08-.18-.13-.38-.23-.2-.1-1.16-.57-1.34-.64-.18-.06-.31-.1-.44.1-.13.2-.5.64-.61.77-.11.13-.23.15-.42.05-.2-.1-.83-.31-1.59-.98-.59-.52-.98-1.17-1.1-1.37-.11-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35-.05-.1-.43-1.08-.6-1.48-.16-.39-.32-.33-.44-.34l-.37-.01z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
