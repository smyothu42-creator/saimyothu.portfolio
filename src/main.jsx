import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import './selv.css'
import App from './App.jsx'
import { loadPage, parseRoute } from './pages'

// The first page's code arrives before the first render, like the later page changes.
loadPage(parseRoute(window.location.pathname).name).then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
