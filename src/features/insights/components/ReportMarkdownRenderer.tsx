type ReportMarkdownRendererProps = {
  markdown: string
}

export function ReportMarkdownRenderer({ markdown }: ReportMarkdownRendererProps) {
  return (
    <div className="report-markdown">
      {parseMarkdown(markdown).map((block, index) => {
        if (block.type === 'heading') {
          return <h3 key={`${block.value}-${index}`}>{block.value}</h3>
        }

        if (block.type === 'list') {
          return (
            <ul key={`${block.value}-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )
        }

        return <p key={`${block.value}-${index}`}>{block.value}</p>
      })}
    </div>
  )
}

type MarkdownBlock =
  | { type: 'heading'; value: string }
  | { type: 'list'; items: string[]; value: string }
  | { type: 'paragraph'; value: string }

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  let activeList: string[] = []

  markdown.split('\n').forEach((line) => {
    const trimmed = line.trim()

    if (!trimmed) {
      flushList(blocks, activeList)
      activeList = []
      return
    }

    if (trimmed.startsWith('##')) {
      flushList(blocks, activeList)
      activeList = []
      blocks.push({ type: 'heading', value: cleanMarkdown(trimmed.replace(/^#+\s*/, '')) })
      return
    }

    if (/^[-*]\s+/.test(trimmed)) {
      activeList.push(cleanMarkdown(trimmed.replace(/^[-*]\s+/, '')))
      return
    }

    flushList(blocks, activeList)
    activeList = []
    blocks.push({ type: 'paragraph', value: cleanMarkdown(trimmed) })
  })

  flushList(blocks, activeList)
  return blocks
}

function flushList(blocks: MarkdownBlock[], items: string[]) {
  if (items.length) {
    blocks.push({ items: [...items], type: 'list', value: items.join('|') })
  }
}

function cleanMarkdown(value: string) {
  return value.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`/g, '')
}
