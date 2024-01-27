import { ApexOptions } from 'apexcharts'
import { getBaseLineChartOptions } from 'components/Molecules/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'

export function getOptions(items: XyValues, raw: StockHistoryItem[], isXSmall: boolean, palette: 'light' | 'dark' = 'light') {
  const toolTipFormatter = (val: number, opts: any) => {
    if (raw.length === 0) {
      return ''
    }
    const change = raw[opts.dataPointIndex].Change! > 0 ? `+$${raw[opts.dataPointIndex].Change?.toFixed(2)}` : `${raw[opts.dataPointIndex].Change?.toFixed(2)}`
    return `$${raw[opts.dataPointIndex].Price.toFixed(2)}   ${change}   ${raw[opts.dataPointIndex].ChangePercent}% `
  }
  const options = getBaseLineChartOptions(items, raw, isXSmall, palette, '$', toolTipFormatter)

  return options
}
