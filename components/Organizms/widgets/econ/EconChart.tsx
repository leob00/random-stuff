'use client'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { calculateStockMovePercent } from 'lib/util/numberUtil'
import EconChangeHeader from './EconChangeHeader'
import { getOptions } from 'components/Organizms/stocks/stockLineChartOptions'
import { shrinkList } from 'components/Organizms/stocks/lineChartOptions'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import numeral from 'numeral'
import { getPositiveNegativeColor, getPositiveNegativeColorReverse } from 'components/Organizms/stocks/StockListItem'
import { VeryLightBlue } from 'components/themes/mainTheme'
import { getLineChartOptions } from 'components/Atoms/Charts/chartJs/lineChartOptions'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import ChartJsTimeSeriesLineChart, { TimeSeriesLineChartModel } from 'components/Organizms/stocks/charts/ChartJsTimeSeriesLineChart'

const EconChart = ({
  symbol,
  data,
  reverseColor,
  isExtraSmall = false,
  showDateSummary = true,
}: {
  symbol: string
  data: EconomicDataItem
  reverseColor?: boolean
  isExtraSmall?: boolean
  showDateSummary?: boolean
}) => {
  const theme = useTheme()
  const isXSmallDevice = useMediaQuery(theme.breakpoints.down('sm'))
  const isXsmall = isExtraSmall ?? isXSmallDevice
  const xValues = data.Chart?.XValues ?? []
  const yValues = data.Chart?.YValues.map((m) => Number(m)) ?? []
  const history = mapEconChartToStockHistory(symbol, xValues, yValues, isExtraSmall)

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
      fontSize: '10px',
    },
  }

  const movePercColor = reverseColor ? getPositiveNegativeColorReverse(movePerc, theme.palette.mode) : getPositiveNegativeColor(movePerc, theme.palette.mode)

  const lineChart: BarChart = {
    labels: x,
    numbers: y,
    colors: [movePercColor],
  }

  const lineChartOptions = getLineChartOptions({ labels: x, numbers: y }, '', '', theme.palette.mode, true, isExtraSmall, isXSmallDevice)

  lineChartOptions.plugins!.tooltip!.callbacks = {
    ...lineChartOptions.plugins!.tooltip!.callbacks,
    label: (tooltipItems) => {
      return ` ${dayjs(tooltipItems.label).format('dddd')}, ${tooltipItems.label}`
    },

    labelTextColor: (tooltipItem) => {
      const clr = reverseColor
        ? getPositiveNegativeColorReverse(history[tooltipItem.dataIndex].Change, theme.palette.mode)
        : getPositiveNegativeColor(history[tooltipItem.dataIndex].Change, theme.palette.mode)
      return clr
    },
    labelColor: (tooltipItem) => {
      const clr = reverseColor
        ? getPositiveNegativeColorReverse(history[tooltipItem.dataIndex].Change, theme.palette.mode)
        : getPositiveNegativeColor(history[tooltipItem.dataIndex].Change, theme.palette.mode)
      return {
        borderColor: clr,
        backgroundColor: clr,
      }
    },
    afterLabel: (tooltipItems) => {
      const price = numeral(history[tooltipItems.dataIndex].Price).format('###,###,0.000')
      const change = numeral(history[tooltipItems.dataIndex].Change).format('###,###,0.000')
      const changePerc = numeral(history[tooltipItems.dataIndex].ChangePercent).format('###,###,0.000')
      return ` ${price}   ${change}   ${changePerc}%`
    },
  }

  const tsModel: TimeSeriesLineChartModel = {
    chartData: lineChart,
    chartOptions: lineChartOptions,
    reverseColor: reverseColor,
  }
  if (isExtraSmall || isXSmallDevice) {
    tsModel.height = 280
  }

  return (
    <Box>
      <Box display={'flex'} gap={1} alignItems={'center'} pl={2}>
        <EconChangeHeader last={last} reverseColor={reverseColor} />
      </Box>
      {showDateSummary && (
        <Box display={'flex'} gap={4} alignItems={'center'} pt={4} justifyContent={'center'}>
          <ReadOnlyField
            //variant='h6'
            label='change'
            val={`${change > 0 ? '+' + numeral(change).format('###,###,0.00') : numeral(change).format('###,###,0.00')}`}
            color={movePercColor}
          />
          <ReadOnlyField label='' val={`${numeral(movePerc).format('###,###,0.000')}%`} color={movePercColor} />
        </Box>
      )}
      <Box>
        <ChartJsTimeSeriesLineChart data={tsModel} />
      </Box>

      {/* <Box pt={2}>
        <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' width={width} height={height} />
      </Box> */}
    </Box>
  )
}

export function mapEconChartToStockHistory(symbol: string, xValues: string[], yValues: number[], isXSmall?: boolean) {
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
  const result = shrinkList(history, isXSmall ? 8 : 30)
  return result
}

export default EconChart
