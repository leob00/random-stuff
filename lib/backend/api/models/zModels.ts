import { z } from 'zod'

export const quoteArraySchema = z
  .object({
    Symbol: z.string(),
    Company: z.string(),
    Price: z.number(),
    Change: z.number(),
    ChangePercent: z.number(),
    TradeDate: z.string(),
  })
  .array()

export type StockQuote = z.infer<typeof quoteArraySchema.element>
