# Project guide

This is a Vite/React portfolio. Keep this file short; use the linked documents for detail.

## Read by task

| Task | Read first | Then inspect |
| --- | --- | --- |
| Runtime, routing, navigation, transitions, deployment | `docs/architecture.md` | `src/main.jsx`, `src/App.jsx`, `src/pages.js`, relevant config |
| Pages, components, case-study blocks, or file location | `docs/project-map.md` | Only the named route/component and its direct imports |
| Styling, typography, responsive behavior, or UI primitives | `docs/design-system.md` | The relevant CSS layer and component |
| Portfolio copy, project order, profile, links, case content | `docs/project-map.md` | `src/data.js`, plus `src/components/Home.jsx` for home-card metrics/media |
| Images, video, audio, fonts, or AVIF behavior | `docs/architecture.md`, `docs/project-map.md` | `public/`, `src/avif.js`, `vite.config.js`, and the referencing data/component |
| Flowy reference page | `docs/design-system.md`, `docs/project-map.md` | `src/flowy/` only |

## Working rules

- Start with this file, the relevant document above, and only the source files named by that document or directly imported by the target code. Do not rescan the whole repository unless the task crosses documented boundaries or the documentation is insufficient.
- Treat `src/` and configuration files as authoritative. Treat `dist/` as generated output and `.tmp-*` as temporary/reference material; do not derive application behavior from them.
- Preserve the custom router, history/scroll restoration, reduced-motion behavior, and media fallbacks unless the task explicitly changes them.
- Content belongs primarily in `src/data.js`; home preview metrics/media additionally live in `src/components/Home.jsx`.
- Keep internal routes as root-relative links so `App.jsx` can intercept them. External links must retain safe new-tab attributes where applicable.
- When architecture, routes, styling ownership, dependencies, or important file locations change, update the affected file in `docs/` in the same change. Update this map only when task routing itself changes.
- Do not hand-edit generated `dist/`. Keep both lockfiles consistent if intentionally supporting both npm and pnpm; otherwise use the package manager chosen for the task and avoid unrelated lockfile churn.

## Verification

- `npm run lint`
- `npm run build`

