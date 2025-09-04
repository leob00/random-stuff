import { EmailMessage } from 'app/serverActions/aws/ses/ses'
import { z } from 'zod'

export const quoteHistorySchema = z
  .object({
    Symbol: z.string(),
    Price: z.number(),
    Change: z.number().optional(),
    ChangePercent: z.number().optional(),
    TradeDate: z.string(),
    Volume: z.number().optional().nullable(),
  })
  .array()

const alertTriggerTypes = ['dailyPercentMove', 'price'] as const
const workflowStatusTypes = ['queued', 'started', 'complete'] as const

const validateNumber = (val: any, allowPostiveOnly?: boolean) => {
  if (isNaN(val)) {
    return false
  }
  if (allowPostiveOnly) {
    if (Number(val) <= 0) {
      return false
    }
  }
  return true
}

export const stockAlertTriggerSchema = z.object({
  target: z
    .string()
    .min(1)
    .refine((val: any) => validateNumber(val, true), { message: 'Please enter a positive number.' }),
  status: z.enum(workflowStatusTypes),
  executedDate: z.string().optional(),
  lastExecutedDate: z.string().optional(),
  message: z.string().optional(),
  typeId: z.enum(alertTriggerTypes),
  typeDescription: z.string().optional(),
  typeInstruction: z.string().optional(),
  enabled: z.boolean(),
  order: z.number(),
  symbol: z.string().optional(),
  reviewed: z.boolean().optional(),
  actual: z.number().optional(),
})

export const quoteArraySchema = z
  .object({
    Symbol: z.string(),
    Company: z.string(),
    Price: z.number(),
    Change: z.number(),
    ChangePercent: z.number(),
    TradeDate: z.string(),
    MarketCapShort: z.string().optional(),
    PeRatio: z.number().nullable().optional(),
    Sector: z.string().nullable().optional(),
    Industry: z.string().nullable().optional(),
    SectorId: z.string().nullable().optional(),
    Volume: z.number().nullable().optional(),
    History: quoteHistorySchema.optional(),
    GroupName: z.string().nullable().optional(),
    MarketCap: z.number().nullable().optional(),
    AnnualDividendYield: z.number().nullable(),
    Tags: z.string().array().nullable().optional(),
    MovingAvg: z.number().nullable().optional(),
    MovingAvgChange: z.number().nullable().optional(),
    MovingAvgDays: z.number().nullable().optional(),
  })
  .array()

export const userSecretArraySchema = z
  .object({
    id: z.string().optional(),
    title: z.string().trim().min(1),
    secret: z.string().trim().min(1),
    salt: z.string().optional(),
    notes: z.string().optional(),
  })
  .array()

export type StockQuote = z.infer<typeof quoteArraySchema.element>
export type StockHistoryItem = z.infer<typeof quoteHistorySchema.element>
export type UserSecret = z.infer<typeof userSecretArraySchema.element>

export type SortableStockKeys = Pick<StockQuote, 'ChangePercent' | 'Company' | 'Change' | 'Symbol' | 'MarketCap' | 'Price' | 'Volume'>
export const quoteSubscriptionSchema = z
  .object({
    id: z.string(),
    symbol: z.string(),
    company: z.string(),
    triggers: stockAlertTriggerSchema.array(),
    lastTriggerExecuteDate: z.string().optional(),
  })
  .array()

export type StockAlertSubscription = z.infer<typeof quoteSubscriptionSchema.element>
export type StockAlertTrigger = z.infer<typeof stockAlertTriggerSchema>
export interface StockAlertSubscriptionWithMessage {
  subscriptions: StockAlertSubscription[]
  message?: EmailMessage
}
