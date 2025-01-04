import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { getStockOrFutureChart } from 'lib/backend/api/qln/chartApi'
import { DropdownItemNumeric } from 'lib/models/dropdown'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import StockChartWithVolume from './StockChartWithVolume'
import { getOptions, mapHistory } from './stockLineChartOptions'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { mutate } from 'swr'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import StockChartDaySelect from './StockChartDaySelect'
import { HistoricalAggregate } from 'lib/backend/api/qln/qlnApi'
import { getPositiveNegativeColor } from './StockListItem'
import FadeOut from 'components/Atoms/Animations/FadeOut'
import HistoricalAggregateDisplay from './HistoricalAggregateDisplay'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Model {
  history: StockHistoryItem[]
  chartOptions: ApexOptions
  aggregate: HistoricalAggregate
}

const StockChart = ({ symbol, companyName, isStock }: { symbol: string; companyName?: string; isStock: boolean }) => {
  const theme = useTheme()
  const { stocksChart, saveStockChart } = useSessionStore()
  const [days, setDays] = useState(stocksChart.defaultDays)
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 300 : 520
  const mutateKey = `stock-chart-${symbol}`

  const dataFn = async () => {
    const response = await getStockOrFutureChart(symbol, days, isStock)
    const map = mapHistory(response.History, 'Price')
    const options = getOptions(map, response.History, isXSmall, theme.palette.mode)

    const result: Model = {
      history: response.History,
      aggregate: response.Aggregate,
      chartOptions: options,
    }

    return result
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const handleDaysSelected = (val: number | null) => {
    setDays(val!)
    saveStockChart({ ...stocksChart, defaultDays: val ?? 90 })
  }
  useEffect(() => {
    mutate(mutateKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days])

  return (
    <Box>
      <StockChartDaySelect selectedDays={days} onSelected={handleDaysSelected} />

      <>
        {companyName && (
          <CenterStack>
            <Typography variant='h5' color='primary' sx={{ textAlign: 'center' }}>
              {companyName}
            </Typography>
          </CenterStack>
        )}
        <>
          {data && (
            <Box>
              {data.aggregate && <HistoricalAggregateDisplay aggregate={data.aggregate} isLoading={isLoading} />}
              {isStock && <StockChartWithVolume data={data.history} symbol={symbol} isLoading={isLoading} />}
              {!isStock && (
                <>
                  {isLoading && <BackdropLoader />}
                  <Box minHeight={{ xs: 300, sm: chartHeight }} pt={2}>
                    {!isLoading && (
                      <FadeIn>
                        <ReactApexChart series={data.chartOptions.series} options={data.chartOptions} type='area' height={chartHeight} />
                        <Box display='flex' gap={4} pb={4}>
                          <Box display='flex' gap={1}>
                            <Typography variant='caption'>start date:</Typography>
                            <Typography variant='caption'>{dayjs(data.history[0].TradeDate).format('MM/DD/YYYY')}</Typography>
                          </Box>
                          {data.history.length > 0 && (
                            <Box display='flex' gap={1}>
                              <Typography variant='caption'>end date:</Typography>
                              <Typography variant='caption'>{dayjs(data.history[data.history.length - 1].TradeDate).format('MM/DD/YYYY')}</Typography>
                            </Box>
                          )}
                        </Box>
                      </FadeIn>
                    )}
                  </Box>
                </>
              )}
            </Box>
          )}
        </>
      </>
    </Box>
  )
}

export default StockChart
