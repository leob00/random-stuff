import { getBaseLineChartOptions } from 'components/Atoms/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { getPositiveNegativeColor, getPositiveNegativeColorReverse } from './StockListItem'
import { sortArray } from 'lib/util/collections'
import { take } from 'lodash'

export function getOptions(
  items: XyValues,
  raw: StockHistoryItem[],
  isXSmall: boolean,
  palette: 'light' | 'dark' = 'light',
  yLabelPrefix: string = '$',
  reverseColor: boolean = false,
) {
  const options = getBaseLineChartOptions(items, {
    raw: raw,
    isXSmall: isXSmall,
    palette: palette,
    yLabelPrefix: yLabelPrefix ?? '$',
    enableAxisXTooltip: false,
    toolTipFormatter: (val: number, opts: any) => {
      return stockChartTooltipFormatter(val, opts, raw, reverseColor)
    },
    changePositiveColor: true,
    reverseColor: reverseColor,
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

export const stockChartTooltipFormatter = (val: number, opts: any, raw: StockHistoryItem[], reverseColor?: boolean) => {
  if (raw.length === 0) {
    return `${val}`
  }
  const change = raw[opts.dataPointIndex].Change! > 0 ? `+${raw[opts.dataPointIndex].Change}` : `${raw[opts.dataPointIndex].Change}`
  const color = reverseColor
    ? getPositiveNegativeColorReverse(raw[opts.dataPointIndex].Change, 'dark')
    : getPositiveNegativeColor(raw[opts.dataPointIndex].Change, 'dark')
  return `<div style="color: ${color}">${raw[opts.dataPointIndex].Price} &nbsp;${change} &nbsp;${raw[opts.dataPointIndex].ChangePercent}%</div>`
}

export const takeLastDays = (history: StockHistoryItem[], days: number) => {
  const newHistory = history.map((m) => {
    return { ...m, TradeDate: dayjs(m.TradeDate).format('YYYY-MM-DD') }
  })
  const sorted = sortArray(newHistory, ['TradeDate'], ['desc'])
  const taken = take(sorted, days)
  return sortArray(taken, ['TradeDate'], ['asc'])
}
