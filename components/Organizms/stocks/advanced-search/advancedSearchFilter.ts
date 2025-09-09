import { z } from 'zod'

const StockMarketCapFilterSchema = z.object({
  includeMegaCap: z.boolean().optional(),
  includeLargeCap: z.boolean().optional(),
  includeMidCap: z.boolean().optional(),
  includeSmallCap: z.boolean().optional(),
})
export type StockMarketCapFilter = z.infer<typeof StockMarketCapFilterSchema>
const checkMovingAvg = (start?: number, end?: number) => {
  if (start && end) {
    if (start > end) {
      return false
    }
  }
  return true
}

const checkMovingAvgDays = (days: number, start?: number, end?: number) => {
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
  .refine((arg) => checkMovingAvgDays(arg.days ?? 0, arg.from, arg.to), {
    message: `please select days`,
    path: ['days'],
  })
  .refine((arg) => checkMovingAvg(arg.from, arg.to), {
    message: `must be greater than or equal to 'from'`,
    path: ['to'],
  })

export const StockAdvancedSearchFilterSchema = z.object({
  take: z.number(),
  marketCap: StockMarketCapFilterSchema,
  movingAvg: StockMovingAvgFilterSchema,
})

export type StockAdvancedSearchFilter = z.infer<typeof StockAdvancedSearchFilterSchema>
