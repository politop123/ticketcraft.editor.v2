import type { PreviewPayload, TicketTemplateElement, TicketTemplateSchema } from '~/types/ticket-editor'
import { resolveTokensInText } from '~/utils/token'
import { cssObjectToInline, elementStylesToCss } from '~/utils/style'

const renderElement = (element: TicketTemplateElement, payload?: PreviewPayload): string => {
  if (!element.visible) {
    return ''
  }

  const sharedStyle = cssObjectToInline({
    position: 'absolute',
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    width: `${element.size.width}px`,
    height: `${element.size.height}px`,
    transform: `rotate(${element.rotation}deg)`,
    zIndex: element.zIndex,
    ...elementStylesToCss(element.styles),
  })

  const textContent = resolveTokensInText(element.content ?? '', payload as Record<string, any>)

  switch (element.type) {
    case 'text':
    case 'dynamic':
      return `<div data-element-id="${element.id}" style="${sharedStyle}">${textContent}</div>`
    case 'image':
      return `<img data-element-id="${element.id}" src="${element.src ?? ''}" alt="ticket-image" style="${sharedStyle}" />`
    case 'qr':
      return `<div data-element-id="${element.id}" style="${sharedStyle};display:flex;align-items:center;justify-content:center;border:1px solid #111;">${textContent || 'QR'}</div>`
    case 'barcode':
      return `<div data-element-id="${element.id}" style="${sharedStyle};display:flex;align-items:center;justify-content:center;border:1px solid #111;letter-spacing:2px;">${textContent || '||| ||| ||| |'}</div>`
    case 'shape':
      return `<div data-element-id="${element.id}" style="${sharedStyle}"></div>`
    case 'line':
      return `<div data-element-id="${element.id}" style="${sharedStyle};height:1px;"></div>`
    default:
      return ''
  }
}

export const generateTemplateHtml = (schema: TicketTemplateSchema, payload?: PreviewPayload): string => {
  const canvasStyle = cssObjectToInline({
    position: 'relative',
    width: `${schema.canvas.width}px`,
    height: `${schema.canvas.height}px`,
    backgroundColor: schema.canvas.backgroundColor,
    backgroundImage: schema.canvas.backgroundImage ? `url('${schema.canvas.backgroundImage}')` : undefined,
    backgroundSize: 'cover',
    overflow: 'hidden',
  })

  const elementsHtml = [...schema.elements]
    .sort((a, b) => a.zIndex - b.zIndex)
    .map(element => renderElement(element, payload))
    .join('')

  return `<section class="ticket-template" data-template-id="${schema.id}" style="${canvasStyle}">${elementsHtml}</section>`
}
