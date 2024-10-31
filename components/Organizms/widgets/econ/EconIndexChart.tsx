import { Box, Typography, useTheme } from '@mui/material'
import { getOptions, takeLastDays } from 'components/Organizms/stocks/stockLineChartOptions'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { calculateStockMovePercent } from 'lib/util/numberUtil'
import dynamic from 'next/dynamic'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const EconIndexChart = ({ symbol, data, width = 300, days }: { symbol: string; data: EconomicDataItem; width?: number; days?: number }) => {
  const history: StockHistoryItem[] = []
  const xValues = data.Chart?.XValues ?? []
  const yValues = data.Chart?.YValues.map((m) => Number(m)) ?? []
  const theme = useTheme()
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
  const resultHistory = days ? takeLastDays(history, days) : history
  const x = resultHistory.map((m) => dayjs(m.TradeDate).format('MM/DD/YYYY'))
  const y = resultHistory.map((m) => m.Price)

  const chartOptions = getOptions({ x: x, y: y }, resultHistory, true, theme.palette.mode, '')
  return (
    <Box>
      <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' width={width} />
      <Box p={2}>
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
export default EconIndexChart
