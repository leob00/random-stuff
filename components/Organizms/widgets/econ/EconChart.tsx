import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { calculateStockMovePercent } from 'lib/util/numberUtil'
import dynamic from 'next/dynamic'
import EconChangeHeader from './EconChangeHeader'
import { getOptions } from 'components/Organizms/stocks/stockLineChartOptions'
import { shrinkList } from 'components/Organizms/stocks/lineChartOptions'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false, loading: () => <BackdropLoader /> })

const EconChart = ({
  symbol,
  data,
  width = 300,
  days,
  height,
  reverseColor,
  isExtraSmall = true,
  showDateSummary = true,
}: {
  symbol: string
  data: EconomicDataItem
  width?: number
  days?: number
  height?: number
  reverseColor?: boolean
  isExtraSmall?: boolean
  showDateSummary?: boolean
}) => {
  const theme = useTheme()
  const isXSmallDevice = useMediaQuery(theme.breakpoints.down('md'))
  const isXsmall = isExtraSmall ?? isXSmallDevice
  const xValues = data.Chart?.XValues ?? []
  const yValues = data.Chart?.YValues.map((m) => Number(m)) ?? []
  const history = mapEconChartToStockHistory(symbol, xValues, yValues)

  const x = history.map((m) => dayjs(m.TradeDate).format('MM/DD/YYYY'))
  const y = history.map((m) => m.Price)

  const last = history[history.length - 1]

  const chartOptions = getOptions({ x: x, y: y }, history, isXsmall, theme.palette.mode, '', reverseColor)
  return (
    <Box>
      <EconChangeHeader last={last} reverseColor={reverseColor} />
      <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' width={width} height={height} />
      {showDateSummary && (
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
      )}
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
  const result = shrinkList(history, 60)
  return result
}

export default EconChart
