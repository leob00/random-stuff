import { Box, Stack, Typography, useTheme } from '@mui/material'
import { getPositiveNegativeColor, getPositiveNegativeColorReverse } from 'components/Organizms/stocks/StockListItem'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { calculateStockMovePercent } from 'lib/util/numberUtil'
import dynamic from 'next/dynamic'
import EconChangeHeader from './EconChangeHeader'
import { getOptions, takeLastDays } from 'components/Organizms/stocks/stockLineChartOptions'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const EconChart = ({
  symbol,
  data,
  width = 300,
  height,
  days,
  reverseColor,
}: {
  symbol: string
  data: EconomicDataItem
  width?: number
  days?: number
  height?: number
  reverseColor?: boolean
}) => {
  const theme = useTheme()

  const xValues = data.Chart?.XValues ?? []
  const yValues = data.Chart?.YValues.map((m) => Number(m)) ?? []
  const history = mapEconChartToStockHistory(symbol, xValues, yValues)

  const resultHistory = days ? takeLastDays(history, days) : history
  const x = resultHistory.map((m) => dayjs(m.TradeDate).format('MM/DD/YYYY'))
  const y = resultHistory.map((m) => m.Price)

  const last = resultHistory[resultHistory.length - 1]

  const chartOptions = getOptions({ x: x, y: y }, resultHistory, true, theme.palette.mode, '', reverseColor)
  return (
    <Box>
      <EconChangeHeader last={last} reverseColor={reverseColor} />
      <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' width={width} height={height} />
      <Box px={2}>
        <Box display='flex' gap={1}>
          <Typography variant='caption'>start date:</Typography>
          <Typography variant='caption'>{x[0]}</Typography>
        </Box>
        <Box display='flex' gap={1}>
          <Typography variant='caption'>end date:</Typography>
          <Typography variant='caption'>{x[x.length - 1]}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export function mapEconChartToStockHistory(symbol: string, xValues: string[], yValues: number[]) {
  const history: StockHistoryItem[] = []
  xValues.forEach((x, index) => {
    const change = index === 0 ? 0 : yValues[index] - yValues[index - 1]
    const h: StockHistoryItem = {
      Price: Number(yValues[index].toFixed(3)),
      Symbol: symbol,
      TradeDate: dayjs(x).format('YYYY-MM-DD'),
      Change: Number(change.toFixed(3)),
      ChangePercent: index === 0 ? 0 : calculateStockMovePercent(yValues[index], change),
    }
    history.push(h)
  })
  return history
}

export default EconChart
