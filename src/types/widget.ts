import type { ComponentType, LazyExoticComponent } from 'react'

export type WidgetSize = {
  w: number
  h: number
}

export type WidgetDefinition = {
  id: string
  name: string
  description: string
  icon: string
  defaultSize: WidgetSize
  minSize: WidgetSize
  maxSize: WidgetSize
  component: LazyExoticComponent<ComponentType>
  settingsComponent?: LazyExoticComponent<ComponentType>
  dataKeys: string[]
}
