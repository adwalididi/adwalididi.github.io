"use client"

import { useEffect, useRef } from "react"

interface BlogPostContentProps {
  content: string
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // Parse markdown-like content into HTML
    const lines = content.split('\n')
    let html = ''
    let inList = false
    let inTable = false
    let tableRows: string[] = []
    let inOrderedList = false
    let inBlockquote = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // Handle tables
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (!inTable) {
          if (inList) { html += '</ul>'; inList = false }
          if (inOrderedList) { html += '</ol>'; inOrderedList = false }
          if (inBlockquote) { html += '</blockquote>'; inBlockquote = false }
          inTable = true
          tableRows = []
        }
        tableRows.push(trimmed)
        continue
      } else if (inTable) {
        // End of table, render it
        html += renderTable(tableRows)
        inTable = false
        tableRows = []
      }

      // Handle empty lines
      if (trimmed === '') {
        if (inList) { html += '</ul>'; inList = false }
        if (inOrderedList) { html += '</ol>'; inOrderedList = false }
        if (inBlockquote) { html += '</blockquote>'; inBlockquote = false }
        continue
      }

      // Handle blockquotes
      if (trimmed.startsWith('> ')) {
        if (inList) { html += '</ul>'; inList = false }
        if (inOrderedList) { html += '</ol>'; inOrderedList = false }
        if (!inBlockquote) { html += '<blockquote>'; inBlockquote = true }
        html += `<p>${formatInlineMarkdown(trimmed.slice(2))}</p>`
        continue
      }

      // Handle headings
      if (trimmed.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false }
        if (inOrderedList) { html += '</ol>'; inOrderedList = false }
        if (inBlockquote) { html += '</blockquote>'; inBlockquote = false }
        html += `<h3>${formatInlineMarkdown(trimmed.slice(4))}</h3>`
        continue
      }
      if (trimmed.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false }
        if (inOrderedList) { html += '</ol>'; inOrderedList = false }
        if (inBlockquote) { html += '</blockquote>'; inBlockquote = false }
        html += `<h2>${formatInlineMarkdown(trimmed.slice(3))}</h2>`
        continue
      }

      // Handle unordered list items
      if (trimmed.startsWith('- ')) {
        if (inOrderedList) { html += '</ol>'; inOrderedList = false }
        if (inBlockquote) { html += '</blockquote>'; inBlockquote = false }
        if (!inList) { html += '<ul>'; inList = true }
        html += `<li>${formatInlineMarkdown(trimmed.slice(2))}</li>`
        continue
      }

      // Handle ordered list items
      const orderedMatch = trimmed.match(/^\d+\.\s(.+)/)
      if (orderedMatch) {
        if (inList) { html += '</ul>'; inList = false }
        if (inBlockquote) { html += '</blockquote>'; inBlockquote = false }
        if (!inOrderedList) { html += '<ol>'; inOrderedList = true }
        html += `<li>${formatInlineMarkdown(orderedMatch[1])}</li>`
        continue
      }

      // Handle regular paragraphs
      if (inList) { html += '</ul>'; inList = false }
      if (inOrderedList) { html += '</ol>'; inOrderedList = false }
      if (inBlockquote) { html += '</blockquote>'; inBlockquote = false }
      html += `<p>${formatInlineMarkdown(trimmed)}</p>`
    }

    // Close any open tags
    if (inList) html += '</ul>'
    if (inOrderedList) html += '</ol>'
    if (inBlockquote) html += '</blockquote>'
    if (inTable) html += renderTable(tableRows)

    contentRef.current.innerHTML = html
  }, [content])

  return (
    <div
      ref={contentRef}
      className="blog-content prose prose-lg max-w-none"
    />
  )
}

function formatInlineMarkdown(text: string): string {
  // Handle bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Handle links
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  // Handle inline code
  text = text.replace(/`(.+?)`/g, '<code>$1</code>')
  return text
}

function renderTable(rows: string[]): string {
  if (rows.length < 2) return ''

  const parseRow = (row: string) =>
    row.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim())

  const headers = parseRow(rows[0])
  // Skip separator row (row[1])
  const dataRows = rows.slice(2).map(parseRow)

  let html = '<div class="table-wrapper"><table><thead><tr>'
  headers.forEach(h => { html += `<th>${formatInlineMarkdown(h)}</th>` })
  html += '</tr></thead><tbody>'
  dataRows.forEach(row => {
    html += '<tr>'
    row.forEach(cell => { html += `<td>${formatInlineMarkdown(cell)}</td>` })
    html += '</tr>'
  })
  html += '</tbody></table></div>'
  return html
}
