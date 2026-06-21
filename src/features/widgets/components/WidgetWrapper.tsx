import { GripVertical, X } from 'lucide-react'
import type { PropsWithChildren } from 'react'

type WidgetWrapperProps = PropsWithChildren<{
  description: string
  onRemove: () => void
  title: string
}>

export function WidgetWrapper({ children, description, onRemove, title }: WidgetWrapperProps) {
  return (
    <section className="widget-wrapper">
      <header className="widget-header">
        <span className="widget-drag-handle" aria-label="Drag widget">
          <GripVertical size={16} />
        </span>
        <div>
          <strong>{title}</strong>
          <small>{description}</small>
        </div>
        <button
          className="icon-action"
          onClick={onRemove}
          type="button"
          aria-label={`Hide ${title} widget`}
        >
          <X size={16} />
        </button>
      </header>
      <div className="widget-body">{children}</div>
    </section>
  )
}
