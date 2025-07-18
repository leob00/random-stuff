import { Box, useMediaQuery, useTheme } from '@mui/material'
import LineChartsSynced from 'components/Atoms/Charts/apex/LineChartsSynced'
import { LineChartOptions } from 'components/Atoms/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'
import { stockChartTooltipFormatter } from './stockLineChartOptions'
import { shrinkList } from './lineChartOptions'
interface SyncedChartModel {
  xyValues: XyValues[]
  options: LineChartOptions[]
}

const StockChartWithVolume = ({ symbol, data, isLoading }: { symbol: string; data: StockHistoryItem[]; isLoading: boolean }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const model = mapModel(symbol, data, isXSmall, theme.palette.mode)

  return (
    <Box>
      <LineChartsSynced key={symbol} xYValues={model.xyValues} lineOptions={model.options} isLoading={isLoading} />
    </Box>
  )
}

const mapModel = (symbol: string, history: StockHistoryItem[], isXSmall: boolean, themeMode: 'light' | 'dark') => {
  const newXYValues: XyValues[] = []
  const opts: LineChartOptions[] = []
  const id = crypto.randomUUID()

  const shrunkHistory = shrinkList(history, 60)

  const x = shrunkHistory.map((m) => dayjs(m.TradeDate).format('MM/DD/YYYY hh:mm a'))
  const priceValues = shrunkHistory.map((m) => m.Price)
  const volumeValues = shrunkHistory.map((m) => m.Volume ?? 0)
  newXYValues.push({
    x: x,
    y: priceValues,
  })
  newXYValues.push({
    x: x,
    y: volumeValues,
  })
  opts.push({
    isXSmall: isXSmall,
    palette: themeMode,
    raw: shrunkHistory,
    changePositiveColor: true,
    yLabelPrefix: '$',
    chartId: `parent-chart-${id}-${symbol}`,
    groupName: `${id}-${symbol}`,
    enableAxisXTooltip: false,
    toolTipFormatter: (val: number, options: any) => {
      return stockChartTooltipFormatter(val, options, shrunkHistory)
    },
  })
  opts.push({
    seriesName: 'Volume',
    isXSmall: true,
    palette: themeMode,
    raw: shrunkHistory,
    yLabelPrefix: '',
    changePositiveColor: false,
    chartId: `child-chart-${symbol}`,
    groupName: `${id}-${symbol}`,
    numericFormatter: (num: number) => {
      return `${numeral(num).format('###,###')}`
    },
    enableAxisXTooltip: false,
  })
  const result: SyncedChartModel = {
    xyValues: newXYValues,
    options: opts,
  }
  return result
}

export default StockChartWithVolume
