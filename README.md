# TicketCraft Editor v2

Production-ready ticket template editor module for Nuxt 4 + Vue 3 + TypeScript.

## Requirements

- Node.js `>= 20.19.0`
- npm `>= 10`

## Quick start

```bash
rm -rf node_modules package-lock.json
npm install
npm run prepare
npm run dev
```

Open: `http://localhost:3000/ticket-editor`

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run prepare` — regenerate Nuxt types

## Nuxt warning about duplicated imports

If you see warnings like duplicated `useAppConfig` during `nuxt prepare`, this is typically caused by mixed/old lockfile state.
Do a clean reinstall with the commands above so dependency graph is re-resolved.
