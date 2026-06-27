import { Plus, X } from 'lucide-react'

import type { WidgetDefinition, WidgetId } from '../types/widget'

type WidgetGalleryProps = {
  activeWidgetIds: string[]
  onClose: () => void
  onAddWidget: (widgetId: WidgetId) => void
  widgets: WidgetDefinition[]
}

export function WidgetGallery({
  activeWidgetIds,
  onAddWidget,
  onClose,
  widgets,
}: WidgetGalleryProps) {
  return (
    <div className="widget-gallery-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="widget-gallery"
        aria-label="Widget gallery"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="widget-gallery-header">
          <div>
            <span className="auth-eyebrow">Widget Gallery</span>
            <h3>Manage dashboard widgets</h3>
            <p>
              Add hidden modules back to this customizable dashboard. Drag widgets by their handle,
              resize them from the corner, or hide them with the X button.
            </p>
          </div>
          <button
            className="icon-action"
            onClick={onClose}
            type="button"
            aria-label="Close widget gallery"
          >
            <X size={16} />
          </button>
        </div>

        <div className="widget-gallery-help">
          <span>{activeWidgetIds.length} active</span>
          <span>{widgets.length - activeWidgetIds.length} hidden</span>
          <span>Saved to Supabase</span>
        </div>

        <div className="widget-gallery-list">
          {widgets.map((widget) => {
            const isActive = activeWidgetIds.includes(widget.id)

            return (
              <button
                className={isActive ? 'widget-gallery-item added' : 'widget-gallery-item'}
                disabled={isActive}
                key={widget.id}
                onClick={() => {
                  onAddWidget(widget.id)
                  onClose()
                }}
                type="button"
              >
                <span>
                  <strong>{widget.title}</strong>
                  <small>
                    {widget.category} - {widget.description}
                  </small>
                </span>
                {isActive ? <b>Added</b> : <Plus size={16} />}
              </button>
            )
          })}
        </div>
      </aside>
    </div>
  )
}
