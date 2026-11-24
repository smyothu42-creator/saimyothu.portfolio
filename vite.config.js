import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Every AVIF in public/ that has a JPG or PNG of the same name, for src/avif.js.
const avifs = (dir = 'public') => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name)
  if (e.isDirectory()) return avifs(p)
  const base = p.replace(/\.avif$/, '')
  return p.endsWith('.avif') && ['.jpg', '.jpeg', '.png'].some((x) => fs.existsSync(base + x)) ? [base.slice('public'.length)] : []
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Share crawlers need absolute image URLs in the initial HTML, before React runs.
  const siteUrl = loadEnv(mode, process.cwd(), '').PORTFOLIO_SITE_URL
  const origin = siteUrl ? new URL(siteUrl).origin : null
  return {
    plugins: [react(), {
      name: 'portfolio-social-urls',
      transformIndexHtml(html) {
        if (!origin) return html
        return html.replaceAll('content="/sai-profile-blue.jpg"', `content="${origin}/sai-profile-blue.jpg"`)
      },
    }],
    define: { __AVIF__: JSON.stringify(avifs()) },
  }
})
