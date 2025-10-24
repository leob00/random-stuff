import { z } from 'zod'

const StockMarketCapFilterSchema = z.object({
  includeMegaCap: z.boolean().optional(),
  includeLargeCap: z.boolean().optional(),
  includeMidCap: z.boolean().optional(),
  includeSmallCap: z.boolean().optional(),
})
export type StockMarketCapFilter = z.infer<typeof StockMarketCapFilterSchema>

const checkNumberRange = (start?: number | null, end?: number | null) => {
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
  .refine((arg) => checkNumberRange(arg.from, arg.to), {
    message: `must be greater than or equal to 'from'`,
    path: ['to'],
  })
export type StockMovingAvgFilter = z.infer<typeof StockMovingAvgFilterSchema>

const NumberRangeFilterSchema = z
  .object({
    from: z.number().optional().nullable(),
    to: z.number().optional().nullable(),
  })
  .refine((arg) => checkNumberRange(arg.from, arg.to), {
    message: `must be greater than or equal to 'from'`,
    path: ['to'],
  })
export type NumberRangeFilter = z.infer<typeof NumberRangeFilterSchema>
export const StockAdvancedSearchFilterSchema = z.object({
  take: z.number(),
  marketCap: StockMarketCapFilterSchema,
  movingAvg: StockMovingAvgFilterSchema,
  peRatio: NumberRangeFilterSchema,
  annualYield: NumberRangeFilterSchema.optional().nullable(),
  symbols: z.string().array().optional(),
})

export type StockAdvancedSearchFilter = z.infer<typeof StockAdvancedSearchFilterSchema>
