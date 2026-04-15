<template>
  <article
    class="canvas-element"
    :class="{ selected, locked: element.locked, hidden: !element.visible }"
    :style="styleObject"
    @pointerdown.stop="onPointerDown"
    @dblclick.stop="onDoubleClick"
  >
    <template v-if="element.type === 'image'">
      <img :src="element.src" alt="ticket element" draggable="false" />
    </template>
    <template v-else-if="element.type === 'shape'">
      <div class="shape" :class="element.shapeType" />
    </template>
    <template v-else-if="element.type === 'line'">
      <div class="line" />
    </template>
    <template v-else>
      <div class="text-content">{{ renderedContent }}</div>
    </template>

    <button v-if="selected && !element.locked" class="resize-handle" @pointerdown.stop.prevent="emit('resize-start', element.id, $event)">↘</button>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PreviewPayload, TicketTemplateElement } from '~/types/ticket-editor'
import { resolveTokensInText } from '~/utils/token'
import { elementStylesToCss } from '~/utils/style'

const props = defineProps<{
  element: TicketTemplateElement
  selected: boolean
  payload: PreviewPayload
}>()

const emit = defineEmits<{
  (event: 'select', id: string, additive: boolean): void
  (event: 'drag-start', id: string, pointerEvent: PointerEvent): void
  (event: 'resize-start', id: string, pointerEvent: PointerEvent): void
  (event: 'inline-edit', id: string): void
}>()

const styleObject = computed(() => ({
  position: 'absolute',
  left: `${props.element.position.x}px`,
  top: `${props.element.position.y}px`,
  width: `${props.element.size.width}px`,
  height: `${props.element.size.height}px`,
  transform: `rotate(${props.element.rotation}deg)`,
  zIndex: props.element.zIndex,
  ...elementStylesToCss(props.element.styles),
}))

const renderedContent = computed(() => resolveTokensInText(props.element.content ?? '', props.payload as Record<string, any>))

const onPointerDown = (event: PointerEvent) => {
  emit('select', props.element.id, event.shiftKey)
  if (!props.element.locked) {
    emit('drag-start', props.element.id, event)
  }
}

const onDoubleClick = () => {
  if (props.element.type === 'text' || props.element.type === 'dynamic') {
    emit('inline-edit', props.element.id)
  }
}
</script>

<style scoped>
.canvas-element {
  border: 1px solid transparent;
  user-select: none;
  overflow: hidden;
}

.canvas-element.selected {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.canvas-element.locked {
  cursor: not-allowed;
}

.canvas-element.hidden {
  opacity: 0.2;
}

img,
.shape,
.line,
.text-content {
  width: 100%;
  height: 100%;
}

.line {
  border-top: 1px solid currentColor;
}

.shape.circle {
  border-radius: 999px;
}

.text-content {
  white-space: pre-wrap;
}

.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  border: none;
  background: #2563eb;
  color: white;
  font-size: 10px;
  cursor: nwse-resize;
}
</style>
