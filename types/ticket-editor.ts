export type TicketUnit = 'px' | 'mm' | 'cm' | 'in'
export type Orientation = 'portrait' | 'landscape'

export type ElementType =
  | 'text'
  | 'image'
  | 'qr'
  | 'barcode'
  | 'shape'
  | 'line'
  | 'dynamic'

export type ShapeType = 'rectangle' | 'circle'

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface TemplateSizePreset {
  id: string
  label: string
  width: number
  height: number
  unit: TicketUnit
}

export interface BaseElementStyles {
  color?: string
  backgroundColor?: string
  fontSize?: number
  fontWeight?: number
  lineHeight?: number
  letterSpacing?: number
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  borderColor?: string
  borderWidth?: number
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderRadius?: number
  opacity?: number
  padding?: number
  objectFit?: 'contain' | 'cover' | 'fill'
}

export interface TicketTemplateElement {
  id: string
  name: string
  type: ElementType
  position: Position
  size: Size
  rotation: number
  zIndex: number
  locked: boolean
  visible: boolean
  styles: BaseElementStyles
  content?: string
  src?: string
  shapeType?: ShapeType
  bindings?: string[]
  metadata?: Record<string, string | number | boolean>
}

export interface TicketTemplateSchema {
  id: string
  name: string
  version: number
  canvas: {
    width: number
    height: number
    unit: TicketUnit
    orientation: Orientation
    backgroundColor: string
    backgroundImage?: string
    showGrid: boolean
    snapToGrid: boolean
    gridSize: number
  }
  elements: TicketTemplateElement[]
  createdAt: string
  updatedAt: string
}

export type EditorMode = 'design' | 'preview' | 'rendered'

export interface HistoryState {
  past: TicketTemplateSchema[]
  future: TicketTemplateSchema[]
}

export interface DynamicFieldToken {
  key: string
  label: string
  category: string
}

export interface PreviewPayload {
  ticket: {
    number: string
    qr: string
    barcode: string
  }
  client: {
    firstName: string
    lastName: string
    fullName: string
  }
  order: {
    reference: string
    total: string
  }
  event: {
    title: string
    date: string
    time: string
    location: string
  }
  seat: {
    section: string
    row: string
    number: string
  }
  merchant: {
    name: string
  }
  custom: Record<string, string>
}
