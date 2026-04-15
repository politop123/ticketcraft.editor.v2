<template>
  <main class="workspace" @pointerdown="onWorkspacePointerDown" @contextmenu.prevent>
    <div class="ruler ruler--top"></div>
    <div class="ruler ruler--left"></div>

    <section class="canvas-wrap" :style="wrapStyle" ref="wrapRef">
      <div class="canvas" :style="canvasStyle">
        <div v-if="store.schema.canvas.showGrid" class="grid" :style="gridStyle" />

        <CanvasElement
          v-for="element in store.orderedElements"
          :key="element.id"
          :element="element"
          :selected="store.selectedIds.includes(element.id)"
          :payload="payload"
          @select="store.select"
          @drag-start="startDrag"
          @resize-start="startResize"
          @inline-edit="enableInlineEdit"
        />

        <textarea
          v-if="inlineEditId"
          class="inline-editor"
          :style="inlineEditorStyle"
          :value="inlineText"
          @input="inlineText = ($event.target as HTMLTextAreaElement).value"
          @blur="commitInlineEdit"
        />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CanvasElement from './CanvasElement.vue'
import { useTicketEditorStore } from '~/stores/ticketEditor'
import { DEFAULT_PREVIEW_PAYLOAD } from '~/constants/ticket-editor'

const store = useTicketEditorStore()
const payload = DEFAULT_PREVIEW_PAYLOAD

const wrapRef = ref<HTMLElement | null>(null)
const inlineEditId = ref<string | null>(null)
const inlineText = ref('')

let dragData: { id: string; startX: number; startY: number; x: number; y: number } | null = null
let resizeData: { id: string; startX: number; startY: number; width: number; height: number } | null = null

const wrapStyle = computed(() => ({
  transform: `translate(${store.pan.x}px, ${store.pan.y}px) scale(${store.zoom})`,
  transformOrigin: 'top left',
}))

const canvasStyle = computed(() => ({
  width: `${store.schema.canvas.width}px`,
  height: `${store.schema.canvas.height}px`,
  background: store.schema.canvas.backgroundColor,
  backgroundImage: store.schema.canvas.backgroundImage ? `url(${store.schema.canvas.backgroundImage})` : undefined,
  backgroundSize: 'cover',
}))

const gridStyle = computed(() => ({
  backgroundSize: `${store.schema.canvas.gridSize}px ${store.schema.canvas.gridSize}px`,
}))

const inlineEditorStyle = computed(() => {
  const element = store.schema.elements.find(item => item.id === inlineEditId.value)
  if (!element) {
    return {}
  }

  return {
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    width: `${element.size.width}px`,
    height: `${element.size.height}px`,
  }
})

const startDrag = (id: string, event: PointerEvent) => {
  const element = store.schema.elements.find(item => item.id === id)
  if (!element) {
    return
  }

  store.pushHistory()
  dragData = {
    id,
    startX: event.clientX,
    startY: event.clientY,
    x: element.position.x,
    y: element.position.y,
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopInteraction)
}

const startResize = (id: string, event: PointerEvent) => {
  const element = store.schema.elements.find(item => item.id === id)
  if (!element) {
    return
  }

  store.pushHistory()
  resizeData = {
    id,
    startX: event.clientX,
    startY: event.clientY,
    width: element.size.width,
    height: element.size.height,
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopInteraction)
}

const onPointerMove = (event: PointerEvent) => {
  if (dragData) {
    const dx = (event.clientX - dragData.startX) / store.zoom
    const dy = (event.clientY - dragData.startY) / store.zoom
    store.updateElement(dragData.id, {
      position: {
        x: Math.max(0, dragData.x + dx),
        y: Math.max(0, dragData.y + dy),
      },
    })
  }

  if (resizeData) {
    const dw = (event.clientX - resizeData.startX) / store.zoom
    const dh = (event.clientY - resizeData.startY) / store.zoom
    store.updateElement(resizeData.id, {
      size: {
        width: Math.max(16, resizeData.width + dw),
        height: Math.max(16, resizeData.height + dh),
      },
    })
  }
}

const stopInteraction = () => {
  dragData = null
  resizeData = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', stopInteraction)
}

const onWorkspacePointerDown = (event: PointerEvent) => {
  if (event.target === wrapRef.value) {
    store.clearSelection()
  }
}

const enableInlineEdit = (id: string) => {
  const element = store.schema.elements.find(item => item.id === id)
  if (!element) {
    return
  }

  inlineEditId.value = id
  inlineText.value = element.content ?? ''
}

const commitInlineEdit = () => {
  if (!inlineEditId.value) {
    return
  }

  store.updateElement(inlineEditId.value, { content: inlineText.value })
  inlineEditId.value = null
}
</script>

<style scoped>
.workspace {
  position: relative;
  flex: 1;
  overflow: auto;
  background: #f3f4f6;
  padding: 28px;
}

.ruler {
  position: absolute;
  background: #e5e7eb;
}

.ruler--top {
  left: 28px;
  top: 0;
  right: 0;
  height: 20px;
}

.ruler--left {
  left: 0;
  top: 28px;
  bottom: 0;
  width: 20px;
}

.canvas-wrap {
  position: relative;
  margin-left: 28px;
  margin-top: 20px;
  width: fit-content;
}

.canvas {
  position: relative;
  box-shadow: 0 12px 38px rgba(2, 6, 23, 0.14);
}

.grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px),
    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
  pointer-events: none;
}

.inline-editor {
  position: absolute;
  z-index: 999;
  border: 1px solid #2563eb;
  border-radius: 6px;
  padding: 6px;
}
</style>
