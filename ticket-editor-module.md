# Ticket Template Editor Module

## Architecture

- `components/ticket-editor/*` — editor shell, toolbar, canvas, inspector, layers, dynamic token picker.
- `stores/ticketEditor.ts` — Pinia state for schema, selection, history stack, autosave draft, clipboard.
- `types/ticket-editor.ts` — strongly typed schema and editor domain models.
- `constants/ticket-editor.ts` — presets, dynamic token catalog, mock preview payload.
- `renderer/html-renderer.ts` — clean HTML export with token-friendly placeholders.
- `export/template-export.ts` — export adapter returning JSON schema + HTML template.
- `composables/*` — keyboard shortcuts and unsaved-changes guard.
- `preview/mock-data.ts` — preview fixture.

## MVP included

- Drag, resize, rotate (inspector), layer ordering controls, lock/visibility, duplicate, delete.
- Multi-select (shift click), copy/paste, undo/redo, autosave, import/export JSON, export HTML.
- Dynamic token picker and token resolving preview.
- Design / Preview / Rendered HTML modes.
- Grid, snap-to-grid toggle, ruler strips, zoom.

## Phase 2 recommendations

1. Smart guides with distance hints.
2. True grouping/ungrouping and nesting.
3. Better crop and media manager (upload to storage API).
4. Context menu and commands palette.
5. Real QR/barcode SVG generators (e.g. qrcode + JsBarcode).
6. Collaboration / locking / optimistic API sync.
