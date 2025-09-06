import { z } from 'zod'

const StockMarketCapFilterSchema = z.object({
  includeMegaCap: z.boolean().optional(),
  includeLargeCap: z.boolean().optional(),
  includeMidCap: z.boolean().optional(),
  includeSmallCap: z.boolean().optional(),
})
export type StockMarketCapFilter = z.infer<typeof StockMarketCapFilterSchema>
const checkMovingAvg = (days?: number, start?: number, end?: number) => {
  if (start || end) {
    if (!days) {
      return false
    }
  }
  return true
}
const StockMovingAvgFilterSchema = z
  .object({
    days: z.number().optional(),
    from: z.number().optional(),
    to: z.number().optional(),
  })
  .refine((arg) => checkMovingAvg(arg.days, arg.from, arg.to), {
    message: 'please select a day.',
    path: ['days'],
  })

export const StockAdvancedSearchFilterSchema = z.object({
  take: z.number(),
  marketCap: StockMarketCapFilterSchema,
  movingAvg: StockMovingAvgFilterSchema,
})

export type StockAdvancedSearchFilter = z.infer<typeof StockAdvancedSearchFilterSchema>
