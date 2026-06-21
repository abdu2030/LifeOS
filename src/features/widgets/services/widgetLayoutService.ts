import { supabase } from '../../../lib/supabase'
import type { PersistedWidgetLayout } from '../types/widget'

const layoutKey = 'dashboard'

type WidgetLayoutRow = {
  widgets: PersistedWidgetLayout[]
}

export async function getWidgetLayouts(userId: string) {
  const { data, error } = await supabase
    .from('widget_layouts')
    .select('widgets')
    .eq('user_id', userId)
    .eq('layout_key', layoutKey)
    .maybeSingle<WidgetLayoutRow>()

  if (error) {
    throw error
  }

  return data?.widgets ?? null
}

export async function saveWidgetLayouts(userId: string, widgets: PersistedWidgetLayout[]) {
  const { error } = await supabase.from('widget_layouts').upsert(
    {
      layout_key: layoutKey,
      user_id: userId,
      widgets,
    },
    {
      onConflict: 'user_id,layout_key',
    },
  )

  if (error) {
    throw error
  }
}
