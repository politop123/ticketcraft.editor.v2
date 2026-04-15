import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { DEFAULT_DYNAMIC_FIELDS, EDITOR_DRAFT_STORAGE_KEY, TEMPLATE_PRESETS } from '~/constants/ticket-editor'
import type {
  DynamicFieldToken,
  EditorMode,
  Orientation,
  TemplateSizePreset,
  TicketTemplateElement,
  TicketTemplateSchema,
  TicketUnit,
} from '~/types/ticket-editor'
import { deepClone } from '~/utils/deep-clone'
import { createId } from '~/utils/id'
import { wrapToken } from '~/utils/token'

const nowIso = () => new Date().toISOString()

const createBaseSchema = (): TicketTemplateSchema => ({
  id: createId('template'),
  name: 'New Ticket Template',
  version: 1,
  canvas: {
    width: 1050,
    height: 540,
    unit: 'px',
    orientation: 'landscape',
    backgroundColor: '#ffffff',
    showGrid: true,
    snapToGrid: true,
    gridSize: 10,
  },
  elements: [],
  createdAt: nowIso(),
  updatedAt: nowIso(),
})

const defaultStyles = {
  color: '#111827',
  backgroundColor: 'transparent',
  fontSize: 16,
  fontWeight: 500,
  lineHeight: 1.2,
  letterSpacing: 0,
  textAlign: 'left' as const,
  borderColor: '#D1D5DB',
  borderWidth: 0,
  borderStyle: 'solid' as const,
  borderRadius: 0,
  opacity: 1,
  padding: 4,
}

export const useTicketEditorStore = defineStore('ticket-editor', () => {
  const schema = ref<TicketTemplateSchema>(createBaseSchema())
  const selectedIds = ref<string[]>([])
  const clipboard = ref<TicketTemplateElement[]>([])
  const dynamicFields = ref<DynamicFieldToken[]>(DEFAULT_DYNAMIC_FIELDS)
  const mode = ref<EditorMode>('design')
  const zoom = ref(1)
  const pan = ref({ x: 0, y: 0 })

  const historyPast = ref<TicketTemplateSchema[]>([])
  const historyFuture = ref<TicketTemplateSchema[]>([])

  const presets = ref<TemplateSizePreset[]>(TEMPLATE_PRESETS)

  const selectedElements = computed(() => schema.value.elements.filter(item => selectedIds.value.includes(item.id)))
  const orderedElements = computed(() => [...schema.value.elements].sort((a, b) => a.zIndex - b.zIndex))
  const canUndo = computed(() => historyPast.value.length > 0)
  const canRedo = computed(() => historyFuture.value.length > 0)
  const hasUnsavedChanges = computed(() => historyPast.value.length > 0)

  const pushHistory = () => {
    historyPast.value.push(deepClone(schema.value))
    if (historyPast.value.length > 100) {
      historyPast.value.shift()
    }
    historyFuture.value = []
  }

  const touchUpdatedAt = () => {
    schema.value.updatedAt = nowIso()
  }

  const addElement = (type: TicketTemplateElement['type']) => {
    pushHistory()
    const zIndex = schema.value.elements.length + 1
    const base: TicketTemplateElement = {
      id: createId(type),
      name: `${type.toUpperCase()} ${zIndex}`,
      type,
      position: { x: 40 + zIndex * 5, y: 40 + zIndex * 5 },
      size: { width: 220, height: type === 'line' ? 2 : 80 },
      rotation: 0,
      zIndex,
      locked: false,
      visible: true,
      styles: { ...defaultStyles },
      content: type === 'dynamic' ? wrapToken('client.fullName') : 'Text',
      src: type === 'image' ? 'https://via.placeholder.com/320x180?text=Ticket+Image' : undefined,
      shapeType: type === 'shape' ? 'rectangle' : undefined,
      bindings: type === 'dynamic' ? ['client.fullName'] : undefined,
    }

    if (type === 'qr') {
      base.content = wrapToken('ticket.qr')
      base.size = { width: 120, height: 120 }
    }

    if (type === 'barcode') {
      base.content = wrapToken('ticket.barcode')
      base.size = { width: 240, height: 72 }
    }

    schema.value.elements.push(base)
    selectedIds.value = [base.id]
    touchUpdatedAt()
  }

  const updateElement = (id: string, patch: Partial<TicketTemplateElement>) => {
    const target = schema.value.elements.find(item => item.id === id)
    if (!target || target.locked) {
      return
    }
    Object.assign(target, patch)
    touchUpdatedAt()
  }

  const updateElementStyle = (id: string, styles: Partial<TicketTemplateElement['styles']>) => {
    const target = schema.value.elements.find(item => item.id === id)
    if (!target || target.locked) {
      return
    }
    target.styles = {
      ...target.styles,
      ...styles,
    }
    touchUpdatedAt()
  }

  const select = (id: string, additive = false) => {
    if (!additive) {
      selectedIds.value = [id]
      return
    }

    if (selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter(item => item !== id)
    } else {
      selectedIds.value.push(id)
    }
  }

  const selectAll = () => {
    selectedIds.value = schema.value.elements.map(item => item.id)
  }

  const clearSelection = () => {
    selectedIds.value = []
  }

  const removeSelected = () => {
    if (!selectedIds.value.length) {
      return
    }
    pushHistory()
    schema.value.elements = schema.value.elements.filter(item => !selectedIds.value.includes(item.id))
    selectedIds.value = []
    touchUpdatedAt()
  }

  const duplicateSelected = () => {
    if (!selectedIds.value.length) {
      return
    }

    pushHistory()
    const clones = schema.value.elements
      .filter(item => selectedIds.value.includes(item.id))
      .map(item => ({
        ...deepClone(item),
        id: createId(item.type),
        name: `${item.name} copy`,
        position: {
          x: item.position.x + 16,
          y: item.position.y + 16,
        },
        zIndex: schema.value.elements.length + 1,
      }))

    schema.value.elements.push(...clones)
    selectedIds.value = clones.map(item => item.id)
    touchUpdatedAt()
  }

  const setMode = (value: EditorMode) => {
    mode.value = value
  }

  const setCanvasSize = (width: number, height: number, unit: TicketUnit, orientation: Orientation) => {
    pushHistory()
    schema.value.canvas.width = width
    schema.value.canvas.height = height
    schema.value.canvas.unit = unit
    schema.value.canvas.orientation = orientation
    touchUpdatedAt()
  }

  const applyPreset = (presetId: string, orientation: Orientation) => {
    const preset = presets.value.find(item => item.id === presetId)
    if (!preset) {
      return
    }

    const width = orientation === 'portrait' ? Math.min(preset.width, preset.height) : Math.max(preset.width, preset.height)
    const height = orientation === 'portrait' ? Math.max(preset.width, preset.height) : Math.min(preset.width, preset.height)
    setCanvasSize(width, height, preset.unit, orientation)
  }

  const moveSelected = (dx: number, dy: number) => {
    if (!selectedIds.value.length) {
      return
    }

    selectedIds.value.forEach(id => {
      const el = schema.value.elements.find(item => item.id === id)
      if (!el || el.locked) {
        return
      }
      const snap = schema.value.canvas.snapToGrid ? schema.value.canvas.gridSize : 1
      el.position.x = Math.max(0, Math.round((el.position.x + dx) / snap) * snap)
      el.position.y = Math.max(0, Math.round((el.position.y + dy) / snap) * snap)
    })

    touchUpdatedAt()
  }

  const toggleLock = (id: string) => {
    const el = schema.value.elements.find(item => item.id === id)
    if (!el) {
      return
    }
    el.locked = !el.locked
    touchUpdatedAt()
  }

  const toggleVisibility = (id: string) => {
    const el = schema.value.elements.find(item => item.id === id)
    if (!el) {
      return
    }
    el.visible = !el.visible
    touchUpdatedAt()
  }

  const copySelected = () => {
    clipboard.value = schema.value.elements.filter(item => selectedIds.value.includes(item.id)).map(item => deepClone(item))
  }

  const pasteClipboard = () => {
    if (!clipboard.value.length) {
      return
    }

    pushHistory()
    const pasted = clipboard.value.map(item => ({
      ...deepClone(item),
      id: createId(item.type),
      position: {
        x: item.position.x + 24,
        y: item.position.y + 24,
      },
      zIndex: schema.value.elements.length + 1,
    }))

    schema.value.elements.push(...pasted)
    selectedIds.value = pasted.map(item => item.id)
    touchUpdatedAt()
  }

  const undo = () => {
    const previous = historyPast.value.pop()
    if (!previous) {
      return
    }

    historyFuture.value.push(deepClone(schema.value))
    schema.value = previous
    selectedIds.value = []
  }

  const redo = () => {
    const next = historyFuture.value.pop()
    if (!next) {
      return
    }

    historyPast.value.push(deepClone(schema.value))
    schema.value = next
    selectedIds.value = []
  }

  const loadSchema = (next: TicketTemplateSchema, addToHistory = true) => {
    if (addToHistory) {
      pushHistory()
    }
    schema.value = deepClone(next)
    selectedIds.value = []
  }

  const resetEditor = () => {
    schema.value = createBaseSchema()
    selectedIds.value = []
    historyPast.value = []
    historyFuture.value = []
  }

  if (process.client) {
    const draft = localStorage.getItem(EDITOR_DRAFT_STORAGE_KEY)
    if (draft) {
      try {
        schema.value = JSON.parse(draft) as TicketTemplateSchema
      } catch {
        // noop
      }
    }

    watch(
      schema,
      value => {
        localStorage.setItem(EDITOR_DRAFT_STORAGE_KEY, JSON.stringify(value))
      },
      { deep: true },
    )
  }

  return {
    schema,
    selectedIds,
    selectedElements,
    orderedElements,
    mode,
    zoom,
    pan,
    presets,
    dynamicFields,
    canUndo,
    canRedo,
    hasUnsavedChanges,
    addElement,
    updateElement,
    updateElementStyle,
    select,
    selectAll,
    clearSelection,
    removeSelected,
    duplicateSelected,
    toggleLock,
    toggleVisibility,
    moveSelected,
    copySelected,
    pasteClipboard,
    undo,
    redo,
    loadSchema,
    resetEditor,
    setMode,
    setCanvasSize,
    applyPreset,
    pushHistory,
  }
})
