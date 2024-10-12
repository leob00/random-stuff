import { z } from 'zod'

const widgetTypes = ['stock-market-sentiment', 'news'] as const
export const WidgetSizesEnum = ['small', 'large'] as const

const DashboardWidgetsSchema = z
  .object({
    id: z.enum(widgetTypes),
    title: z.string().min(1),
    display: z.boolean(),
    waitToRenderMs: z.number(),
    widgetSizes: z.enum(WidgetSizesEnum).optional(),
  })
  .array()
export type DashboardWidget = z.infer<typeof DashboardWidgetsSchema.element>

export type DashboardWidgetWithSettings = {
  settings?: unknown
} & DashboardWidget
