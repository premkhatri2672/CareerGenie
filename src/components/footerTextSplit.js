export function splitTextToSpans(el) {
  if (!el) return []
  const text = (el.textContent || '').trim()
  el.textContent = ''

  const spans = []
  for (const ch of text) {
    
    const span = document.createElement('span')
    span.textContent = ch === ' ' ? '\u00A0' : ch
    span.className = 'footer-char'
    el.appendChild(span)
    spans.push(span)
  }
  return spans
}

