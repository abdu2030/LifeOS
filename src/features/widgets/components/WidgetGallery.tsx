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
  const availableWidgets = widgets.filter((widget) => !activeWidgetIds.includes(widget.id))

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
            <h3>Add dashboard widgets</h3>
            <p>Choose hidden modules to add back to your personal command center.</p>
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

        {availableWidgets.length ? (
          <div className="widget-gallery-list">
            {availableWidgets.map((widget) => (
              <button
                className="widget-gallery-item"
                key={widget.id}
                onClick={() => {
                  onAddWidget(widget.id)
                  onClose()
                }}
                type="button"
              >
                <span>
                  <strong>{widget.title}</strong>
                  <small>{widget.category}</small>
                </span>
                <Plus size={16} />
              </button>
            ))}
          </div>
        ) : (
          <p className="finance-empty">
            All widgets are already on your dashboard. Hide one to add it again later.
          </p>
        )}
      </aside>
    </div>
  )
}
