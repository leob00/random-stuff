import { getBaseLineChartOptions } from 'components/Atoms/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'

export function getOptions(items: XyValues, raw: StockHistoryItem[], isXSmall: boolean, palette: 'light' | 'dark' = 'light') {
  const options = getBaseLineChartOptions(items, {
    raw: raw,
    isXSmall: isXSmall,
    palette: palette,
    yLabelPrefix: '$',
    toolTipFormatter: (val: number, opts: any) => {
      return stockChartTooltipFormatter(val, opts, raw)
    },

    changePositiveColor: true,
  })

  return options
}

export const mapHistory = (items: StockHistoryItem[], yKey: keyof StockHistoryItem) => {
  const result: XyValues = {
    x: [],
    y: [],
  }
  if (items.length === 0) {
    return result
  }
  result.name = items.length > 0 ? items[0].Symbol : ''
  result.x = items.map((o) => dayjs(o.TradeDate).format('MM/DD/YYYY hh:mm a'))
  result.y = items.map((o) => Number(o[yKey]))
  return result
}

export const stockChartTooltipFormatter = (val: number, opts: any, raw: any[]) => {
  if (raw.length === 0) {
    return `${val}`
  }
  const change = raw[opts.dataPointIndex].Change! > 0 ? `+$${raw[opts.dataPointIndex].Change?.toFixed(2)}` : `${raw[opts.dataPointIndex].Change?.toFixed(2)}`
  return `$${raw[opts.dataPointIndex].Price.toFixed(2)}   ${change}   ${raw[opts.dataPointIndex].ChangePercent}% `
}
