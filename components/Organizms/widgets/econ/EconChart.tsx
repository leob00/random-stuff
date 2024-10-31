import { Box, Stack, Typography, useTheme } from '@mui/material'
import { getPositiveNegativeColor } from 'components/Organizms/stocks/StockListItem'
import { getOptions } from 'components/Organizms/stocks/lineChartOptions'
import { takeLastDays } from 'components/Organizms/stocks/stockLineChartOptions'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { calculateStockMovePercent } from 'lib/util/numberUtil'
import dynamic from 'next/dynamic'
import numeral from 'numeral'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const EconChart = ({ symbol, data, width = 300, days }: { symbol: string; data: EconomicDataItem; width?: number; days?: number }) => {
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

  const last = resultHistory[resultHistory.length - 1]

  const chartOptions = getOptions({ x: x, y: y }, resultHistory, true, theme.palette.mode, false)
  return (
    <Box>
      <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' width={width} />
      <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} alignItems={'center'}>
        <Stack direction={'row'} spacing={2} pl={2} sx={{ backgroundColor: 'unset' }} pt={1}>
          <Typography variant='h6'>{`${numeral(last.Price).format('###,###,0.00')}`}</Typography>
          <Typography variant='h6'>{`${last.Change}`}</Typography>
          <Typography variant='h6'>{`${last.ChangePercent}%`}</Typography>
        </Stack>
      </Stack>
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
export default EconChart
