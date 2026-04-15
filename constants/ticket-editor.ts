import type { DynamicFieldToken, PreviewPayload, TemplateSizePreset } from '~/types/ticket-editor'

export const TEMPLATE_PRESETS: TemplateSizePreset[] = [
  { id: 'standard', label: 'Standard Ticket', width: 105, height: 54, unit: 'mm' },
  { id: 'a4', label: 'A4', width: 210, height: 297, unit: 'mm' },
  { id: 'a5', label: 'A5', width: 148, height: 210, unit: 'mm' },
  { id: 'custom', label: 'Custom', width: 120, height: 60, unit: 'mm' },
]

export const DEFAULT_DYNAMIC_FIELDS: DynamicFieldToken[] = [
  { key: 'ticket.number', label: 'Ticket Number', category: 'Ticket' },
  { key: 'ticket.qr', label: 'Ticket QR Value', category: 'Ticket' },
  { key: 'ticket.barcode', label: 'Ticket Barcode Value', category: 'Ticket' },
  { key: 'client.firstName', label: 'Client First Name', category: 'Client' },
  { key: 'client.lastName', label: 'Client Last Name', category: 'Client' },
  { key: 'client.fullName', label: 'Client Full Name', category: 'Client' },
  { key: 'order.reference', label: 'Order Reference', category: 'Order' },
  { key: 'order.total', label: 'Order Total', category: 'Order' },
  { key: 'event.title', label: 'Event Title', category: 'Event' },
  { key: 'event.date', label: 'Event Date', category: 'Event' },
  { key: 'event.time', label: 'Event Time', category: 'Event' },
  { key: 'event.location', label: 'Event Location', category: 'Event' },
  { key: 'seat.section', label: 'Seat Section', category: 'Seat' },
  { key: 'seat.row', label: 'Seat Row', category: 'Seat' },
  { key: 'seat.number', label: 'Seat Number', category: 'Seat' },
  { key: 'merchant.name', label: 'Merchant Name', category: 'Merchant' },
  { key: 'custom.fieldName', label: 'Custom Field', category: 'Custom' },
]

export const DEFAULT_PREVIEW_PAYLOAD: PreviewPayload = {
  ticket: {
    number: 'TCK-2026-0001842',
    qr: 'TCK-2026-0001842|event=Jazz Night|seat=A-12',
    barcode: '5901234123457',
  },
  client: {
    firstName: 'Olena',
    lastName: 'Kovalenko',
    fullName: 'Olena Kovalenko',
  },
  order: {
    reference: 'ORD-66A8D1',
    total: '₴1,250.00',
  },
  event: {
    title: 'Kyiv Jazz Evening',
    date: '2026-06-21',
    time: '19:30',
    location: 'Palace of Arts, Kyiv',
  },
  seat: {
    section: 'A',
    row: '4',
    number: '12',
  },
  merchant: {
    name: 'TicketCraft Events',
  },
  custom: {
    fieldName: 'VIP Guest',
  },
}

export const EDITOR_DRAFT_STORAGE_KEY = 'ticket-template-editor-draft'
