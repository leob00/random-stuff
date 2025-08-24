import { z } from 'zod'

export const StockMovingAvgFilterSchema = z.object({
  take: z.number(),
  days: z.number(),
  //  marketCap: z.string().array(),
})

export type StockMovingAvgFilter = z.infer<typeof StockMovingAvgFilterSchema>
