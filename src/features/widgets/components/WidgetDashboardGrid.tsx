import GridLayout from 'react-grid-layout'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'

import { defaultWidgetIds, getWidgetDefinition, widgetRegistry } from '../registry/widgetRegistry'
import type { WidgetId, WidgetLayoutItem } from '../types/widget'
import { useWidgetLayouts } from '../hooks/useWidgetLayouts'
import { WidgetGallery } from './WidgetGallery'
import { WidgetWrapper } from './WidgetWrapper'

type GridLayoutProps = {
  children: ReactNode
  className?: string
  cols: number
  draggableHandle?: string
  layout: WidgetLayoutItem[]
  margin?: [number, number]
  onLayoutChange?: (layout: readonly WidgetLayoutItem[]) => void
  rowHeight: number
  width: number
}

const TypedGridLayout = GridLayout as unknown as ComponentType<GridLayoutProps>

export function WidgetDashboardGrid() {
  const { error, isSaving, layouts, resetLayouts, updateLayouts } = useWidgetLayouts()
  const activeWidgetIds = layouts.map((layout) => layout.i)
  const galleryWidgets = defaultWidgetIds.map((widgetId) => widgetRegistry[widgetId])
  const gridShellRef = useRef<HTMLDivElement>(null)
  const [gridWidth, setGridWidth] = useState(900)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  useEffect(() => {
    const gridShell = gridShellRef.current

    if (!gridShell) {
      return undefined
    }

    const observer = new ResizeObserver(([entry]) => {
      setGridWidth(Math.max(320, Math.floor(entry.contentRect.width)))
    })

    observer.observe(gridShell)

    return () => observer.disconnect()
  }, [])

  function handleAddWidget(widgetId: WidgetId) {
    const definition = getWidgetDefinition(widgetId)

    if (activeWidgetIds.includes(widgetId)) {
      return
    }

    void updateLayouts([...layouts, { ...definition.defaultLayout, y: Infinity }])
  }

  function handleLayoutChange(nextLayouts: readonly WidgetLayoutItem[]) {
    void updateLayouts([...nextLayouts])
  }

  function handleRemoveWidget(widgetId: WidgetId) {
    void updateLayouts(layouts.filter((layout) => layout.i !== widgetId))
  }

  return (
    <section className="widget-dashboard">
      <div className="widget-toolbar">
        <div>
          <span className="auth-eyebrow">Custom dashboard</span>
          <h2>Arrange your LifeOS widgets</h2>
          <p>Drag cards to shape the workspace around how you plan, track, and review.</p>
        </div>
        <div className="widget-toolbar-actions">
          {isSaving ? <span>Saving layout...</span> : null}
          {error ? <span className="auth-error">{error}</span> : null}
          <button
            className="primary-action compact-action"
            onClick={() => setIsGalleryOpen(true)}
            type="button"
          >
            <Plus size={16} />
            Add widget
          </button>
          <button className="ghost-select" onClick={resetLayouts} type="button">
            Reset layout
          </button>
        </div>
      </div>

      <div className="widget-dashboard-layout">
        <div className="widget-grid-shell" ref={gridShellRef}>
          <TypedGridLayout
            className="layout"
            cols={12}
            draggableHandle=".widget-drag-handle"
            layout={layouts}
            margin={[14, 14]}
            onLayoutChange={handleLayoutChange}
            rowHeight={72}
            width={gridWidth}
          >
            {layouts.map((layout) => {
              const definition = getWidgetDefinition(layout.i as WidgetId)
              const Widget = definition.component

              return (
                <div key={definition.id}>
                  <WidgetWrapper
                    description={definition.description}
                    onRemove={() => handleRemoveWidget(definition.id)}
                    title={definition.title}
                  >
                    <Widget />
                  </WidgetWrapper>
                </div>
              )
            })}
          </TypedGridLayout>
        </div>

        {!layouts.length ? (
          <div className="widget-empty-state">
            <strong>No widgets on this dashboard</strong>
            <p>Add a widget from the gallery to rebuild your workspace.</p>
            <button
              className="primary-action compact-action"
              onClick={() => setIsGalleryOpen(true)}
              type="button"
            >
              <Plus size={16} />
              Add widget
            </button>
          </div>
        ) : null}
      </div>

      {isGalleryOpen ? (
        <WidgetGallery
          activeWidgetIds={activeWidgetIds}
          onAddWidget={handleAddWidget}
          onClose={() => setIsGalleryOpen(false)}
          widgets={galleryWidgets}
        />
      ) : null}
    </section>
  )
}
