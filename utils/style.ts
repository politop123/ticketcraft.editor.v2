import type { BaseElementStyles } from '~/types/ticket-editor'

export const elementStylesToCss = (styles: BaseElementStyles): Record<string, string | number | undefined> => ({
  color: styles.color,
  backgroundColor: styles.backgroundColor,
  fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
  fontWeight: styles.fontWeight,
  lineHeight: styles.lineHeight,
  letterSpacing: styles.letterSpacing ? `${styles.letterSpacing}px` : undefined,
  textAlign: styles.textAlign,
  borderColor: styles.borderColor,
  borderWidth: styles.borderWidth ? `${styles.borderWidth}px` : undefined,
  borderStyle: styles.borderStyle,
  borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : undefined,
  opacity: styles.opacity,
  padding: styles.padding ? `${styles.padding}px` : undefined,
  objectFit: styles.objectFit,
})

export const cssObjectToInline = (styles: Record<string, string | number | undefined>): string => {
  return Object.entries(styles)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${value}`)
    .join(';')
}
