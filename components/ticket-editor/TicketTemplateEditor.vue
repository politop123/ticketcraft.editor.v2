<template>
  <section class="editor-root">
    <EditorToolbar
      @import-schema="importSchema"
      @export-schema="exportSchema"
      @export-html="exportHtml"
    />

    <div class="mode-switcher">
      <button :class="{ active: store.mode === 'design' }" @click="store.setMode('design')">Design</button>
      <button :class="{ active: store.mode === 'preview' }" @click="store.setMode('preview')">Preview</button>
      <button :class="{ active: store.mode === 'rendered' }" @click="store.setMode('rendered')">Rendered HTML</button>
      <span class="status">Autosave enabled</span>
    </div>

    <div class="layout">
      <SidebarElements />

      <CanvasWorkspace v-if="store.mode !== 'rendered'" />

      <section v-else class="rendered-panel">
        <h3>Rendered HTML</h3>
        <textarea readonly :value="renderedHtml" rows="20" />
        <h3>Live Result</h3>
        <div class="preview-html" v-html="renderedHtml"></div>
      </section>

      <InspectorPanel />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CanvasWorkspace from './CanvasWorkspace.vue'
import EditorToolbar from './EditorToolbar.vue'
import InspectorPanel from './InspectorPanel.vue'
import SidebarElements from './SidebarElements.vue'
import { useTicketEditorShortcuts } from '~/composables/useTicketEditorShortcuts'
import { useUnsavedChangesGuard } from '~/composables/useUnsavedChangesGuard'
import { DEFAULT_PREVIEW_PAYLOAD } from '~/constants/ticket-editor'
import { exportTemplate } from '~/export/template-export'
import { useTicketEditorStore } from '~/stores/ticketEditor'
import type { TicketTemplateSchema } from '~/types/ticket-editor'

const store = useTicketEditorStore()

useTicketEditorShortcuts()
useUnsavedChangesGuard()

const renderedHtml = computed(() => exportTemplate(store.schema, DEFAULT_PREVIEW_PAYLOAD).html)

const exportSchema = () => {
  downloadFile(`${store.schema.name}.json`, JSON.stringify(store.schema, null, 2), 'application/json')
}

const importSchema = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'

  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) {
      return
    }

    const value = await file.text()
    const schema = JSON.parse(value) as TicketTemplateSchema
    store.loadSchema(schema)
  }

  input.click()
}

const exportHtml = () => {
  downloadFile(`${store.schema.name}.html`, renderedHtml.value, 'text/html')
}

const downloadFile = (fileName: string, content: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.editor-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
  color: #111827;
}

.mode-switcher {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 14px;
  border-bottom: 1px solid #e5e7eb;
}

.mode-switcher button {
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 6px 10px;
  background: #fff;
  font-size: 12px;
}

.mode-switcher button.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #1d4ed8;
}

.status {
  margin-left: auto;
  font-size: 12px;
  color: #10b981;
}

.layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 320px;
  height: 100%;
  min-height: 0;
}

.rendered-panel {
  padding: 16px;
  overflow: auto;
  display: grid;
  gap: 12px;
}

.rendered-panel textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  padding: 10px;
}

.preview-html {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
  background: #f9fafb;
  overflow: auto;
}

@media (max-width: 1200px) {
  .layout {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .layout :deep(.inspector) {
    position: fixed;
    right: 0;
    top: 90px;
    bottom: 0;
    width: 320px;
    background: #fff;
    box-shadow: -12px 0 22px rgba(0, 0, 0, 0.1);
  }
}
</style>
