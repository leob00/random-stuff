import { z } from 'zod'

const widgetTypes = ['stock-market-sentiment', 'news', 'snp', 'dowjones'] as const
const WidgetSizesEnum = ['sm', 'md', 'lg'] as const
const WidgetSizeEnumSchema = z.enum(WidgetSizesEnum)

export type WidgetSize = z.infer<typeof WidgetSizeEnumSchema>

const DashboardWidgetsSchema = z
  .object({
    id: z.enum(widgetTypes),
    title: z.string().min(1),
    display: z.boolean(),
    waitToRenderMs: z.number(),
    size: WidgetSizeEnumSchema.optional(),
    allowSizeChange: z.boolean().optional(),
  })
  .array()
export type DashboardWidget = z.infer<typeof DashboardWidgetsSchema.element>

export type DashboardWidgetWithSettings = {
  settings?: unknown
} & DashboardWidget
