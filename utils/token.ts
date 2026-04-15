export const wrapToken = (tokenKey: string) => `{{${tokenKey}}}`

export const resolveTokenPath = (payload: Record<string, any>, path: string): string => {
  return path.split('.').reduce<any>((acc, part) => (acc ? acc[part] : undefined), payload) ?? ''
}

export const resolveTokensInText = (input: string, payload: Record<string, any>): string => {
  return input.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, tokenPath: string) => {
    return String(resolveTokenPath(payload, tokenPath) ?? '')
  })
}
