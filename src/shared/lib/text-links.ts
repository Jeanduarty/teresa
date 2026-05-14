const URL_PATTERN = /https?:\/\/[^\s<>"')]+/gi

export function extractLinksFromText(value: string): string[] {
  return Array.from(new Set(value.match(URL_PATTERN) ?? []))
}

export function splitTextWithLinks(value: string): Array<{ type: 'text' | 'link'; value: string }> {
  const parts: Array<{ type: 'text' | 'link'; value: string }> = []
  let lastIndex = 0

  for (const match of value.matchAll(URL_PATTERN)) {
    const url = match[0]
    const index = match.index ?? 0

    if (index > lastIndex) {
      parts.push({ type: 'text', value: value.slice(lastIndex, index) })
    }

    parts.push({ type: 'link', value: url })
    lastIndex = index + url.length
  }

  if (lastIndex < value.length) {
    parts.push({ type: 'text', value: value.slice(lastIndex) })
  }

  return parts
}
