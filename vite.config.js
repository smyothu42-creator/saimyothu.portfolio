import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Every AVIF in public/ that has a JPG or PNG of the same name, for src/avif.js.
const avifs = (dir = 'public') => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name)
  if (e.isDirectory()) return avifs(p)
  const base = p.replace(/\.avif$/, '')
  return p.endsWith('.avif') && ['.jpg', '.jpeg', '.png'].some((x) => fs.existsSync(base + x)) ? [base.slice('public'.length)] : []
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: { __AVIF__: JSON.stringify(avifs()) },
})
