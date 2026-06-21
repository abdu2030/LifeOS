import { Plus } from 'lucide-react'

import type { WidgetDefinition, WidgetId } from '../types/widget'

type WidgetGalleryProps = {
  activeWidgetIds: string[]
  onAddWidget: (widgetId: WidgetId) => void
  widgets: WidgetDefinition[]
}

export function WidgetGallery({ activeWidgetIds, onAddWidget, widgets }: WidgetGalleryProps) {
  return (
    <aside className="widget-gallery" aria-label="Widget gallery">
      <div>
        <span className="auth-eyebrow">Widget Gallery</span>
        <h3>Add dashboard widgets</h3>
        <p>Choose modules to add to your personal command center.</p>
      </div>

      <div className="widget-gallery-list">
        {widgets.map((widget) => {
          const isActive = activeWidgetIds.includes(widget.id)

          return (
            <button
              className="widget-gallery-item"
              disabled={isActive}
              key={widget.id}
              onClick={() => onAddWidget(widget.id)}
              type="button"
            >
              <span>
                <strong>{widget.title}</strong>
                <small>{widget.category}</small>
              </span>
              {isActive ? <small>Added</small> : <Plus size={16} />}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
