import { Box, Typography, useTheme } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { getMarketChart, MarketCategory } from 'lib/backend/api/qln/chartApi'
import { useState } from 'react'
import StockChartWithVolume from './StockChartWithVolume'
import { mapHistory } from './stockLineChartOptions'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { mutate } from 'swr'
import StockChartDaySelect, { getYearToDateDays } from './StockChartDaySelect'
import { DateRange, HistoricalAggregate } from 'lib/backend/api/qln/qlnApi'
import HistoricalAggregateDisplay from './HistoricalAggregateDisplay'
import { shrinkList, shrinkListByViewportSize } from './lineChartOptions'
import { MovingAvg } from 'lib/backend/api/qln/qlnModels'
import MovingAvgValues from './movingAvg/MovingAvgValues'
import ChartJsTimeSeriesLineChart, { TimeSeriesLineChartModel } from './charts/ChartJsTimeSeriesLineChart'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { getPositiveNegativeColor, getPositiveNegativeColorReverse } from './StockListItem'
import { getLineChartOptions } from 'components/Atoms/Charts/chartJs/lineChartOptions'
import numeral from 'numeral'
import { useViewPortSize } from 'hooks/ui/useViewportSize'

interface Model {
  history: StockHistoryItem[]
  // chartOptions: ApexOptions
  aggregate: HistoricalAggregate
  availableDates?: DateRange | null
  movingAvg?: MovingAvg[] | null
  timeSeriesModel: TimeSeriesLineChartModel
}

const StockChart = ({ symbol, companyName, marketCategory }: { symbol: string; companyName?: string; marketCategory: MarketCategory }) => {
  const theme = useTheme()
  const { viewPortSize } = useViewPortSize()
  const isXSmallDevice = viewPortSize === 'xs'

  const { stocksChart: stockChartSettings, saveStockChart } = useSessionStore()
  const chartHeight = isXSmallDevice ? 300 : 520
  const mutateKey = `stock-chart-${symbol}`
  const [isWaiting, setIsWaiting] = useState(false)

  const dataFn = async () => {
    let days = stockChartSettings.defaultDays
    if (days === -1) {
      days = getYearToDateDays()
    }

    const response = await getMarketChart(symbol, marketCategory, days)
    const history = marketCategory !== 'stocks' ? shrinkListByViewportSize(response.History, viewPortSize) : shrinkList(response.History, 60)
    const map = mapHistory(history, 'Price')

    const lineColor = getPositiveNegativeColor(history[history.length - 1].Price - history[0].Price, theme.palette.mode)
    const lineChart: BarChart = {
      labels: map.x,
      numbers: map.y,
      colors: [lineColor],
    }
    const reverseColor = false
    const lineChartOptions = getLineChartOptions(lineChart, '', '', theme.palette.mode, true, false, isXSmallDevice)
    lineChartOptions.plugins!.tooltip!.callbacks = {
      ...lineChartOptions.plugins!.tooltip!.callbacks,
      label: (tooltipItems) => {
        if (marketCategory === 'crypto') {
          return ` ${dayjs(tooltipItems.label).format('dddd')}, ${dayjs(tooltipItems.label).format('MM/DD/YYYY')}`
        } else {
          return ` ${dayjs(tooltipItems.label).format('dddd')}, ${tooltipItems.label}`
        }
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

    const result: Model = {
      history: history,
      aggregate: response.Aggregate,
      //chartOptions: options,
      availableDates: response.AvailableDates,
      movingAvg: response.MovingAvg,
      timeSeriesModel: {
        chartData: lineChart,
        chartOptions: lineChartOptions,
        isXSmallDevice: isXSmallDevice,
      },
    }

    return result
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: true })

  const handleDaysSelected = async (val: number) => {
    setIsWaiting(true)
    let days = val
    if (val === -1) {
      days = getYearToDateDays()
    }
    saveStockChart({ ...stockChartSettings, defaultDays: val === -1 ? val : days })
    const results = await dataFn()
    mutate(mutateKey, results)
    setIsWaiting(false)
  }

  return (
    <Box>
      {isLoading || (isWaiting && <ComponentLoader />)}
      {data && (
        <StockChartDaySelect selectedDays={stockChartSettings.defaultDays} onSelected={handleDaysSelected} availableDates={data.availableDates ?? undefined} />
      )}

      <>
        {companyName && (
          <CenterStack>
            <Typography variant='h5' color='primary' sx={{ textAlign: 'center' }}>
              {companyName}
            </Typography>
          </CenterStack>
        )}
        <Box minHeight={chartHeight + 60}>
          {data && (
            <Box>
              {data.aggregate && <HistoricalAggregateDisplay aggregate={data.aggregate} />}

              {marketCategory === 'stocks' && <ChartJsTimeSeriesLineChart data={data.timeSeriesModel} />}

              {/* {marketCategory === 'stocks' && <StockChartWithVolume data={data.history} symbol={symbol} isLoading={isLoading || isWaiting} />} */}
              {data.movingAvg && data.movingAvg.length > 0 && (
                <Box py={2}>
                  <MovingAvgValues values={data.movingAvg} startAt={7} />
                </Box>
              )}
              {marketCategory !== 'stocks' && (
                <>
                  <Box minHeight={{ xs: 300, sm: chartHeight }} pt={2}>
                    {data && (
                      <Box>
                        <ChartJsTimeSeriesLineChart data={data.timeSeriesModel} />
                        {/* <FadeIn>
                          <ReactApexChart series={data.chartOptions.series} options={data.chartOptions} type='area' height={chartHeight} />
                        </FadeIn> */}
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>
      </>
    </Box>
  )
}

export default StockChart
