# TicketCraft Editor v2

Production-ready ticket template editor module for Nuxt 4 + Vue 3 + TypeScript.

## Requirements

- Node.js `>= 20.19.0`
- npm `>= 10`

## Quick start

```bash
npm install
npm run dev
```

Open: `http://localhost:3000/ticket-editor`

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run prepare` — regenerate Nuxt types
- `npm run cleanup` — clear `.nuxt`/cache via `nuxi cleanup`
- `npm run refresh` — cleanup + prepare (recommended after dependency/version changes)

## Warning: duplicated `useAppConfig` during `nuxt prepare`

If you see warning lines about duplicated `useAppConfig` imports:

1. Run `npm run refresh`
2. If still present, run full clean install:

```bash
rm -rf node_modules package-lock.json .nuxt .output
npm install
npm run prepare
```

In Nuxt 4 this warning can be non-blocking; if types are generated and app runs, it is safe to continue.
