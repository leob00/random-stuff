import { Box, useMediaQuery, useTheme } from '@mui/material'
import LineChartsSynced from 'components/Atoms/Charts/apex/LineChartsSynced'
import { LineChartOptions } from 'components/Atoms/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'
import { stockChartTooltipFormatter } from './stockLineChartOptions'
import { getPagedArray } from 'lib/util/collections'
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

  let chunkSize = history.length
  if (chunkSize > 1000) {
    chunkSize = 20
  }
  if (chunkSize > 500) {
    chunkSize = 10
  }
  if (chunkSize > 220) {
    chunkSize = 5
  }
  if (chunkSize > 100) {
    chunkSize = 2
  }
  const chunks = getPagedArray(history, chunkSize)

  let dateValues: string[] = []
  let priceValues: number[] = []
  let volumeValues: number[] = []
  if (chunks.length > 1) {
    chunks.forEach((chunk, i) => {
      if (i === 0) {
        dateValues.push(dayjs(chunk.items[0].TradeDate).format('MM/DD/YYYY hh:mm a'))
        priceValues.push(chunk.items[0].Price)
        volumeValues.push(chunk.items[0].Volume ?? 0)
      } else {
        dateValues.push(dayjs(chunk.items[chunk.items.length - 1].TradeDate).format('MM/DD/YYYY hh:mm a'))
        priceValues.push(chunk.items[chunk.items.length - 1].Price)
        volumeValues.push(chunk.items[chunk.items.length - 1].Volume ?? 0)
      }
    })
  } else {
    dateValues = history.map((m) => dayjs(m.TradeDate).format('MM/DD/YYYY hh:mm a'))
    priceValues = history.map((m) => m.Price)
    volumeValues = history.map((m) => m.Volume ?? 0)
  }

  newXYValues.push({
    x: dateValues,
    y: priceValues,
  })
  newXYValues.push({
    x: dateValues,
    y: volumeValues,
  })
  opts.push({
    isXSmall: isXSmall,
    palette: themeMode,
    raw: history,
    changePositiveColor: true,
    yLabelPrefix: '$',
    chartId: `${id}-${symbol}`,
    groupName: `${id}-${symbol}`,
    enableAxisXTooltip: false,
    toolTipFormatter: (val: number, options: any) => {
      return stockChartTooltipFormatter(val, options, history)
    },
  })
  opts.push({
    seriesName: 'Volume',
    isXSmall: true,
    palette: themeMode,
    raw: history,
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
