import { z } from 'zod'

const WidgetSizesEnum = ['sm', 'md', 'lg'] as const
const WidgetSizeEnumSchema = z.enum(WidgetSizesEnum)

const widgetCategories = ['stock-market-sentiment', 'news', 'econ-ind-index', 'econ-ind', 'earnings'] as const
const widgetids = [
  'stock-market-sentiment',
  'news',
  'dowjones',
  'snp',
  'unemployment-rate',
  'mortgage-rate-30',
  'mortgage-rate-15',
  'earnings-calendar',
] as const

export type WidgetSize = z.infer<typeof WidgetSizeEnumSchema>

const DashboardWidgetsSchema = z
  .object({
    id: z.enum(widgetids), // does not matter what is, but must be unique
    internalId: z.string().optional(),
    title: z.string().min(1),
    display: z.boolean(),
    waitToRenderMs: z.number(),
    size: WidgetSizeEnumSchema,
    allowSizeChange: z.boolean().optional(),
    category: z.enum(widgetCategories),
  })
  .array()
export type DashboardWidget = z.infer<typeof DashboardWidgetsSchema.element>

export type DashboardWidgetWithSettings = {
  settings?: unknown
} & DashboardWidget
