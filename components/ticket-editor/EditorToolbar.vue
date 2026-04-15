<template>
  <header class="toolbar">
    <div class="toolbar__group">
      <button @click="store.undo" :disabled="!store.canUndo">Undo</button>
      <button @click="store.redo" :disabled="!store.canRedo">Redo</button>
      <button @click="store.duplicateSelected" :disabled="!store.selectedIds.length">Duplicate</button>
      <button @click="store.removeSelected" :disabled="!store.selectedIds.length">Delete</button>
    </div>

    <div class="toolbar__group">
      <label class="toolbar__label">Preset</label>
      <select v-model="selectedPreset" @change="onPresetChange">
        <option v-for="preset in store.presets" :key="preset.id" :value="preset.id">
          {{ preset.label }}
        </option>
      </select>

      <select v-model="orientation" @change="onPresetChange">
        <option value="portrait">Portrait</option>
        <option value="landscape">Landscape</option>
      </select>
    </div>

    <div class="toolbar__group">
      <button @click="store.zoom = Math.max(0.2, store.zoom - 0.1)">-</button>
      <span class="zoom-label">{{ Math.round(store.zoom * 100) }}%</span>
      <button @click="store.zoom = Math.min(3, store.zoom + 0.1)">+</button>
    </div>

    <div class="toolbar__group">
      <button @click="$emit('import-schema')">Import JSON</button>
      <button @click="$emit('export-schema')">Export JSON</button>
      <button @click="$emit('export-html')">Export HTML</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTicketEditorStore } from '~/stores/ticketEditor'

defineEmits<{
  (event: 'import-schema'): void
  (event: 'export-schema'): void
  (event: 'export-html'): void
}>()

const store = useTicketEditorStore()
const selectedPreset = ref('standard')
const orientation = ref<'portrait' | 'landscape'>('landscape')

const onPresetChange = () => {
  store.applyPreset(selectedPreset.value, orientation.value)
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid #e5e7eb;
  background: color-mix(in oklab, #fff 95%, #f3f4f6 5%);
}

.toolbar__group {
  display: flex;
  align-items: center;
  gap: 8px;
}

button,
select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 10px;
  background: white;
  font-size: 13px;
}

button:disabled {
  opacity: 0.45;
}

.zoom-label {
  font-size: 13px;
  min-width: 50px;
  text-align: center;
}

.toolbar__label {
  font-size: 13px;
  color: #4b5563;
}
</style>
