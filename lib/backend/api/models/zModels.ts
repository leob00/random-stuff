import { z } from 'zod'

export const quoteHistorySchema = z
  .object({
    Price: z.number(),
    TradeDate: z.string(),
  })
  .array()

export const quoteArraySchema = z
  .object({
    Symbol: z.string(),
    Company: z.string(),
    Price: z.number(),
    Change: z.number(),
    ChangePercent: z.number(),
    TradeDate: z.string(),
    MarketCapShort: z.string().optional(),
    PeRatio: z.number().optional(),
    Sector: z.string().optional(),
    History: quoteHistorySchema.optional(),
  })
  .array()

export type StockQuote = z.infer<typeof quoteArraySchema.element>
export type StockHistory = z.infer<typeof quoteHistorySchema.element>
