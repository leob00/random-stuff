import { z } from 'zod'

export const StockMovingAvgFilterSchema = z
  .object({
    take: z.number(),
    days: z.number(),
    includeMegaCap: z.boolean().optional(),
    includeLargeCap: z.boolean().optional(),
    includeMidCap: z.boolean().optional(),
    includeSmallCap: z.boolean().optional(),
  })
  .refine((arg) => !!arg.includeLargeCap || !!arg.includeMegaCap || !!arg.includeMidCap || !!arg.includeSmallCap, {
    message: 'please select at least one market cap filter.',
    path: ['includeMegaCap'],
  })

export type StockMovingAvgFilter = z.infer<typeof StockMovingAvgFilterSchema>
