import { z } from 'zod'

const DashboardWidgetsSchema = z
  .object({
    id: z.enum(['stock-market-sentiment', 'news']),
    title: z.string().min(1),
    waitToRenderMs: z.number(),
  })
  .array()
export type DashboardWidget = z.infer<typeof DashboardWidgetsSchema.element>
