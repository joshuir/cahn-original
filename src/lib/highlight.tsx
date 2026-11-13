import React from 'react'

/** Wraps the first case-insensitive match of `q` in <mark>. */
export function highlight(text: string, q?: string) {
  if (!q) return text
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

/** Short excerpt around the first match in a long body of text. */
export function snippet(text: string, q: string, radius = 70) {
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return null
  const start = Math.max(0, i - radius)
  const end = Math.min(text.length, i + q.length + radius)
  return `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\s+/g, ' ')}${end < text.length ? '…' : ''}`
}
