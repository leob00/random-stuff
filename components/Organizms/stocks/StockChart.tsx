import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { getMarketChart, MarketCategory } from 'lib/backend/api/qln/chartApi'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import StockChartWithVolume from './StockChartWithVolume'
import { getOptions, mapHistory } from './stockLineChartOptions'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { mutate } from 'swr'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import StockChartDaySelect, { getYearToDateDays } from './StockChartDaySelect'
import { DateRange, HistoricalAggregate } from 'lib/backend/api/qln/qlnApi'
import HistoricalAggregateDisplay from './HistoricalAggregateDisplay'
import { shrinkList } from './lineChartOptions'
import { MovingAvg } from 'lib/backend/api/qln/qlnModels'
import MovingAvgValues from './movingAvg/MovingAvgValues'
import { VeryLightBlue } from 'components/themes/mainTheme'
import ChartJsTimeSeriesLineChart, { TimeSeriesLineChartModel } from './charts/ChartJsTimeSeriesLineChart'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Model {
  history: StockHistoryItem[]
  chartOptions: ApexOptions
  aggregate: HistoricalAggregate
  availableDates?: DateRange | null
  movingAvg?: MovingAvg[] | null
}

const StockChart = ({ symbol, companyName, marketCategory }: { symbol: string; companyName?: string; marketCategory: MarketCategory }) => {
  const theme = useTheme()
  const { stocksChart: stockChartSettings, saveStockChart } = useSessionStore()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 300 : 520
  const mutateKey = `stock-chart-${symbol}`
  const [isWaiting, setIsWaiting] = useState(false)

  const dataFn = async () => {
    let days = stockChartSettings.defaultDays
    if (days === -1) {
      days = getYearToDateDays()
    }

    const response = await getMarketChart(symbol, marketCategory, days)
    const history = shrinkList(response.History, 60)
    const map = mapHistory(history, 'Price')

    const options = getOptions(map, history, isXSmall, theme.palette.mode)
    options.xaxis = { ...options.xaxis, type: 'datetime', axisTicks: { show: true, borderType: 'none', color: VeryLightBlue } }
    options.xaxis.labels = {
      ...options.xaxis!.labels,
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

    const result: Model = {
      history: history,
      aggregate: response.Aggregate,
      chartOptions: options,
      availableDates: response.AvailableDates,
      movingAvg: response.MovingAvg,
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
      {/* {isLoading || (isWaiting && <BackdropLoader />)} */}
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
              {data.aggregate && !isLoading && <HistoricalAggregateDisplay aggregate={data.aggregate} />}

              {marketCategory === 'stocks' && <StockChartWithVolume data={data.history} symbol={symbol} isLoading={isLoading || isWaiting} />}
              {data.movingAvg && data.movingAvg.length > 0 && (
                <Box py={2}>
                  <MovingAvgValues values={data.movingAvg} startAt={7} />
                </Box>
              )}
              {marketCategory !== 'stocks' && (
                <>
                  <Box minHeight={{ xs: 300, sm: chartHeight }} pt={2}>
                    {!isLoading && !isWaiting && (
                      <Box>
                        <FadeIn>
                          <ReactApexChart series={data.chartOptions.series} options={data.chartOptions} type='area' height={chartHeight} />
                        </FadeIn>
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
