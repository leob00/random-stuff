'use client'
import { Box, Breakpoint, useMediaQuery, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { calculateStockMovePercent } from 'lib/util/numberUtil'
import { getOptions } from 'components/Organizms/stocks/stockLineChartOptions'
import { shrinkList, shrinkListByViewportSize } from 'components/Organizms/stocks/lineChartOptions'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import numeral from 'numeral'
import { getPositiveNegativeColor, getPositiveNegativeColorReverse } from 'components/Organizms/stocks/StockListItem'
import { VeryLightBlue } from 'components/themes/mainTheme'
import { getLineChartOptions } from 'components/Atoms/Charts/chartJs/lineChartOptions'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import ChartJsTimeSeriesLineChart, { TimeSeriesLineChartModel } from 'components/Organizms/stocks/charts/ChartJsTimeSeriesLineChart'
import { useViewPortSize } from 'hooks/ui/useViewportSize'

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
  const { viewPortSize } = useViewPortSize()

  const rawData = data.Chart?.RawData ?? []
  const history = mapEconChartToStockHistory(symbol, rawData as EconomicDataItem[], viewPortSize)

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
    title: (tooltipItems) => {
      return ``
    },
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
    isXSmallDevice: isXSmallDevice,
    //tickColors: tickColors,
  }
  if (isExtraSmall || isXSmallDevice) {
    tsModel.height = 280
  }

  return (
    <Box>
      {showDateSummary && (
        <Box display={'flex'} gap={4} alignItems={'center'} pt={4} justifyContent={'center'}>
          <ReadOnlyField
            //variant='h6'
            label='change'
            val={`${change > 0 ? '+' + numeral(change).format('###,###,0.00') : numeral(change).format('###,###,0.00')}`}
            color={movePercColor}
          />
          <ReadOnlyField
            label=''
            val={`${movePerc > 0 ? '+' + numeral(movePerc).format('###,###,0.00') : numeral(movePerc).format('###,###,0.00')}%`}
            color={movePercColor}
          />
        </Box>
      )}
      <Box>
        <ChartJsTimeSeriesLineChart data={tsModel} />
      </Box>
    </Box>
  )
}

export function mapEconChartToStockHistory(symbol: string, rawData: EconomicDataItem[], viewportSize?: Breakpoint) {
  const history: StockHistoryItem[] = []
  rawData.forEach((item, index) => {
    const change = index === 0 ? 0 : rawData[index].Value - rawData[index - 1].Value
    const h: StockHistoryItem = {
      Price: rawData[index].Value,
      Symbol: symbol,
      TradeDate: dayjs(item.LastObservationDate).format('YYYY-MM-DD'),
      Change: Number(change),
      ChangePercent: index === 0 ? 0 : calculateStockMovePercent(rawData[index].Value, change),
    }
    history.push(h)
  })
  const result = shrinkListByViewportSize(history, viewportSize ?? 'sm')
  return result
}

export default EconChart
