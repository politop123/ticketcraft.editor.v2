<template>
  <aside class="sidebar">
    <h3>Elements</h3>
    <div class="stack">
      <button v-for="item in elements" :key="item.type" @click="store.addElement(item.type)">
        {{ item.label }}
      </button>
    </div>

    <h3>Canvas</h3>
    <div class="stack stack--inputs">
      <label>
        Width
        <input type="number" v-model.number="width" @change="applyCustomSize" min="50" />
      </label>
      <label>
        Height
        <input type="number" v-model.number="height" @change="applyCustomSize" min="50" />
      </label>
      <label>
        Unit
        <select v-model="unit" @change="applyCustomSize">
          <option value="px">px</option>
          <option value="mm">mm</option>
          <option value="cm">cm</option>
          <option value="in">in</option>
        </select>
      </label>
      <label>
        Grid
        <input type="number" v-model.number="store.schema.canvas.gridSize" min="2" max="64" />
      </label>
      <label class="inline">
        <input type="checkbox" v-model="store.schema.canvas.showGrid" /> Show grid
      </label>
      <label class="inline">
        <input type="checkbox" v-model="store.schema.canvas.snapToGrid" /> Snap to grid
      </label>
    </div>

    <h3>Background</h3>
    <label>
      Color
      <input type="color" :value="store.schema.canvas.backgroundColor" @input="onBackgroundColor" />
    </label>
    <label>
      Background image URL
      <input type="text" :value="store.schema.canvas.backgroundImage" @change="onBackgroundImage" placeholder="https://..." />
    </label>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTicketEditorStore } from '~/stores/ticketEditor'

const store = useTicketEditorStore()

const elements = [
  { type: 'text', label: 'Text' },
  { type: 'dynamic', label: 'Dynamic Text' },
  { type: 'image', label: 'Image' },
  { type: 'qr', label: 'QR Code' },
  { type: 'barcode', label: 'Barcode' },
  { type: 'shape', label: 'Shape' },
  { type: 'line', label: 'Line' },
] as const

const width = ref(store.schema.canvas.width)
const height = ref(store.schema.canvas.height)
const unit = ref(store.schema.canvas.unit)

const applyCustomSize = () => {
  store.setCanvasSize(width.value, height.value, unit.value as any, store.schema.canvas.orientation)
}

const onBackgroundColor = (event: Event) => {
  const target = event.target as HTMLInputElement
  store.schema.canvas.backgroundColor = target.value
}

const onBackgroundImage = (event: Event) => {
  const target = event.target as HTMLInputElement
  store.schema.canvas.backgroundImage = target.value
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 260px;
  padding: 14px;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
}

h3 {
  font-size: 13px;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.06em;
  margin: 8px 0 0;
}

.stack {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.stack--inputs {
  grid-template-columns: 1fr;
}

button,
input,
select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px;
  font-size: 13px;
  background: #fff;
}

label {
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #4b5563;
}

.inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inline input {
  width: auto;
}
</style>
