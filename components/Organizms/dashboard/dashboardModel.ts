import { z } from 'zod'

export const widgetTypes = ['stock-market-sentiment', 'news'] as const

const DashboardWidgetsSchema = z
  .object({
    id: z.enum(widgetTypes),
    title: z.string().min(1),
    display: z.boolean(),
    waitToRenderMs: z.number(),
  })
  .array()
export type DashboardWidget = z.infer<typeof DashboardWidgetsSchema.element>
