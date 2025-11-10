'use client'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { calculateStockMovePercent } from 'lib/util/numberUtil'
import dynamic from 'next/dynamic'
import EconChangeHeader from './EconChangeHeader'
import { getOptions } from 'components/Organizms/stocks/stockLineChartOptions'
import { shrinkList } from 'components/Organizms/stocks/lineChartOptions'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import numeral from 'numeral'
import { getPositiveNegativeColor, getPositiveNegativeColorReverse } from 'components/Organizms/stocks/StockListItem'
import { VeryLightBlue } from 'components/themes/mainTheme'
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
  const first = history[0]
  const change = last.Price - first.Price
  const movePerc = calculateStockMovePercent(last.Price, change)

  const chartOptions = getOptions({ x: x, y: y }, history, isXsmall, theme.palette.mode, '', reverseColor)
  chartOptions.xaxis = { ...chartOptions.xaxis, type: 'datetime', axisTicks: { show: true, borderType: 'none', color: VeryLightBlue } }
  chartOptions.xaxis.labels = {
    ...chartOptions.xaxis!.labels,
    show: true,
    rotate: 340,
    rotateAlways: true,
    formatter: (val, timestamp, opts) => {
      return dayjs(val).format('MM/DD/YYYY')
    },
    offsetX: 4,
    offsetY: 16,

    style: {
      fontSize: '9px',
    },
  }

  const color = reverseColor ? getPositiveNegativeColorReverse(last.Change, theme.palette.mode) : getPositiveNegativeColor(last.Change, theme.palette.mode)

  return (
    <Box>
      <Box display={'flex'} gap={1} alignItems={'center'} pl={2}>
        <Typography variant='body2'>last: </Typography>
        <EconChangeHeader last={last} reverseColor={reverseColor} />
      </Box>
      <Box pt={2}>
        <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' width={width} height={height} />
      </Box>
      {showDateSummary && (
        <Box px={2}>
          <Box display={'flex'} gap={4}>
            <ReadOnlyField label='start date' val={x[0]} />
            <ReadOnlyField label='end date' val={x[x.length - 1]} />
          </Box>
          <Box display={'flex'} gap={4} alignItems={'center'}>
            <ReadOnlyField
              label='change'
              val={`${change > 0 ? '+' + numeral(change).format('###,###,0.00') : numeral(change).format('###,###,0.00')}`}
              color={color}
            />
            <ReadOnlyField label='' val={`${numeral(movePerc).format('###,###,0.000')}%`} color={color} />
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
      Price: Number(yValues[index]),
      Symbol: symbol,
      TradeDate: dayjs(x).format('YYYY-MM-DD'),
      Change: Number(change),
      ChangePercent: index === 0 ? 0 : calculateStockMovePercent(yValues[index], change),
    }
    history.push(h)
  })
  const result = shrinkList(history, 60)
  return result
}

export default EconChart
