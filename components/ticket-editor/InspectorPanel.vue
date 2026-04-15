<template>
  <aside class="inspector">
    <h3>Inspector</h3>

    <div v-if="!active">Select element to edit.</div>

    <template v-else>
      <label>
        Name
        <input :value="active.name" @input="patch({ name: targetValue($event) })" />
      </label>

      <div class="row">
        <label>X <input type="number" :value="active.position.x" @input="patch({ position: { ...active.position, x: numberValue($event) } })" /></label>
        <label>Y <input type="number" :value="active.position.y" @input="patch({ position: { ...active.position, y: numberValue($event) } })" /></label>
      </div>

      <div class="row">
        <label>W <input type="number" :value="active.size.width" @input="patch({ size: { ...active.size, width: Math.max(1, numberValue($event)) } })" /></label>
        <label>H <input type="number" :value="active.size.height" @input="patch({ size: { ...active.size, height: Math.max(1, numberValue($event)) } })" /></label>
      </div>

      <label>
        Rotation
        <input type="number" :value="active.rotation" @input="patch({ rotation: numberValue($event) })" />
      </label>

      <label v-if="isTextLike">
        Content
        <textarea :value="active.content" @input="patch({ content: targetValue($event) })" rows="4" />
      </label>

      <label v-if="active.type === 'image'">
        Image URL
        <input :value="active.src" @input="patch({ src: targetValue($event) })" />
      </label>

      <h4>Style</h4>
      <div class="row">
        <label>Text color <input type="color" :value="active.styles.color" @input="patchStyle({ color: targetValue($event) })" /></label>
        <label>Background <input type="color" :value="normalizeColor(active.styles.backgroundColor)" @input="patchStyle({ backgroundColor: targetValue($event) })" /></label>
      </div>

      <div class="row">
        <label>Size <input type="number" :value="active.styles.fontSize" @input="patchStyle({ fontSize: numberValue($event) })" /></label>
        <label>Weight <input type="number" :value="active.styles.fontWeight" @input="patchStyle({ fontWeight: numberValue($event) })" /></label>
      </div>

      <div class="row">
        <label>Opacity <input type="number" min="0" max="1" step="0.1" :value="active.styles.opacity" @input="patchStyle({ opacity: numberValue($event) })" /></label>
        <label>Radius <input type="number" :value="active.styles.borderRadius" @input="patchStyle({ borderRadius: numberValue($event) })" /></label>
      </div>
    </template>

    <LayersPanel />
    <DynamicFieldPicker @insert="insertToken" />
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DynamicFieldPicker from './DynamicFieldPicker.vue'
import LayersPanel from './LayersPanel.vue'
import { useTicketEditorStore } from '~/stores/ticketEditor'
import { wrapToken } from '~/utils/token'

const store = useTicketEditorStore()

const active = computed(() => store.selectedElements[0])
const isTextLike = computed(() => active.value && ['text', 'dynamic', 'qr', 'barcode'].includes(active.value.type))

const targetValue = (event: Event) => (event.target as HTMLInputElement).value
const numberValue = (event: Event) => Number((event.target as HTMLInputElement).value)

const patch = (payload: Record<string, unknown>) => {
  if (!active.value) {
    return
  }
  store.updateElement(active.value.id, payload)
}

const patchStyle = (payload: Record<string, unknown>) => {
  if (!active.value) {
    return
  }
  store.updateElementStyle(active.value.id, payload)
}

const normalizeColor = (value?: string) => {
  if (!value || value === 'transparent') {
    return '#ffffff'
  }

  return value
}

const insertToken = (token: string) => {
  if (!active.value) {
    store.addElement('dynamic')
  }
  const current = active.value?.content ?? ''
  patch({ content: `${current} ${wrapToken(token)}`.trim() })
}
</script>

<style scoped>
.inspector {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 320px;
  border-left: 1px solid #e5e7eb;
  padding: 14px;
  overflow: auto;
}

h3,
h4 {
  margin: 0;
  color: #374151;
}

label {
  display: grid;
  gap: 4px;
  font-size: 12px;
  color: #4b5563;
}

input,
textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px;
  font-size: 13px;
}

.row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
</style>
