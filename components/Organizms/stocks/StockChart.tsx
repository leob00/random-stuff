import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import CenterStack from 'components/Atoms/CenterStack'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { getStockOrFutureChart } from 'lib/backend/api/qln/chartApi'
import { DropdownItem, DropdownItemNumeric } from 'lib/models/dropdown'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import StockChartWithVolume from './StockChartWithVolume'
import { getOptions, mapHistory } from './stockLineChartOptions'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { mutate } from 'swr'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

export const stockChartDaySelect: DropdownItemNumeric[] = [
  { text: '1 week', value: 7 },
  { text: '1 month', value: 30 },
  { text: '3 months', value: 90 },
  { text: '6 months', value: 180 },
  { text: '1 year', value: 365 },
  { text: '3 year', value: 1095 },
  { text: '5 year', value: 1825 },
]

interface Model {
  history: StockHistoryItem[]
  chartOptions: ApexOptions
}

const StockChart = ({ symbol, companyName, isStock }: { symbol: string; companyName?: string; isStock: boolean }) => {
  const theme = useTheme()

  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 300 : 520

  const { stocksChart, saveStockChart } = useSessionStore()
  //const [days, setDays] = useState(stocksChart.defaultDays)

  const mutateKey = `stock-chart${symbol}`

  const dataFn = async () => {
    const history = await getStockOrFutureChart(symbol, stocksChart.defaultDays, isStock)
    const map = mapHistory(history, 'Price')
    const options = getOptions(map, history, isXSmall, theme.palette.mode)
    const result: Model = {
      history: history,
      chartOptions: options,
    }

    return result
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const handleDaysSelected = (val: number | null) => {
    saveStockChart({ ...stocksChart, defaultDays: val ?? 90 })
  }
  useEffect(() => {
    mutate(mutateKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocksChart.defaultDays])

  return (
    <Box>
      {/* {isLoading && <BackdropLoader />} */}
      <Box textAlign={'right'} pr={1} py={1}>
        <FormDropdownListNumeric options={stockChartDaySelect} value={stocksChart.defaultDays} onOptionSelected={handleDaysSelected} />
      </Box>
      <>
        {companyName && (
          <CenterStack>
            <Typography variant='h5' color='primary' sx={{ textAlign: 'center' }}>
              {companyName}
            </Typography>
          </CenterStack>
        )}
        <>
          {isStock ? (
            <>
              <StockChartWithVolume data={data?.history ?? []} symbol={symbol} isLoading={isLoading} />
            </>
          ) : (
            <>
              {data && (
                <Box minHeight={{ xs: 300, sm: chartHeight }} pt={2}>
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
                </Box>
              )}
            </>
          )}
        </>
      </>
    </Box>
  )
}

export default StockChart
