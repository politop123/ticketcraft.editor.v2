import type { PreviewPayload, TicketTemplateSchema } from '~/types/ticket-editor'
import { generateTemplateHtml } from '~/renderer/html-renderer'

export interface TemplateExportResult {
  schema: TicketTemplateSchema
  html: string
}

export const exportTemplate = (schema: TicketTemplateSchema, payload?: PreviewPayload): TemplateExportResult => {
  return {
    schema,
    html: generateTemplateHtml(schema, payload),
  }
}
