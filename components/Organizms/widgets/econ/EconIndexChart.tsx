import { Box, Typography, useTheme } from '@mui/material'
import { getOptions, takeLastDays } from 'components/Organizms/stocks/stockLineChartOptions'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import dynamic from 'next/dynamic'
import EconChangeHeader from './EconChangeHeader'
import { mapEconChartToStockHistory } from './EconChart'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const EconIndexChart = ({
  symbol,
  data,
  width = 300,
  days,
  showDateSummary = true,
}: {
  symbol: string
  data: EconomicDataItem
  width?: number
  days?: number
  showDateSummary?: boolean
}) => {
  const theme = useTheme()

  const xValues = data.Chart?.XValues ?? []
  const yValues = data.Chart?.YValues.map((m) => Number(m)) ?? []
  const history = mapEconChartToStockHistory(symbol, xValues, yValues, false)
  const resultHistory = days ? takeLastDays(history, days) : history
  const x = resultHistory.map((m) => dayjs(m.TradeDate).format('MM/DD/YYYY'))
  const y = resultHistory.map((m) => m.Price)

  const last = resultHistory[resultHistory.length - 1]

  const chartOptions = getOptions({ x: x, y: y }, resultHistory, true, theme.palette.mode, '')
  return (
    <Box>
      <EconChangeHeader last={last} showLabel />
      <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' width={width} />
      {showDateSummary && (
        <>
          (
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
          )
        </>
      )}
    </Box>
  )
}
export default EconIndexChart
