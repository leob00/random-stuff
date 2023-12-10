import { Box, CssBaseline, Typography, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import CenterStack from 'components/Atoms/CenterStack'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { getStockOrFutureChart } from 'lib/backend/api/qln/chartApi'
import { DropdownItem } from 'lib/models/dropdown'
import dynamic from 'next/dynamic'
import React from 'react'
import { getOptions } from './stockLineChartOptions'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })
export const stockChartDaySelect: DropdownItem[] = [
  { text: '1 week', value: '7' },
  { text: '1 month', value: '30' },
  { text: '3 months', value: '90' },
  { text: '6 months', value: '180' },
  { text: '1 year', value: '365' },
  { text: '3 year', value: '1095' },
  { text: '5 year', value: '1825' },
]
const StockChart = ({ symbol, history, companyName, isStock }: { symbol: string; history: StockHistoryItem[]; companyName?: string; isStock: boolean }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 300 : 520
  const [isLoading, setIsLoading] = React.useState(true)

  const mapHistory = (items: StockHistoryItem[]) => {
    const result: XyValues = {
      x: [],
      y: [],
    }
    if (items.length === 0) {
      return result
    }

    result.x = items.map((o) => dayjs(o.TradeDate).format('MM/DD/YYYY'))
    result.y = items.map((o) => o.Price)

    return result
  }

  const handleDaysSelected = async (val: string) => {
    setIsLoading(true)
    const result = await getStockOrFutureChart(symbol, Number(val), isStock)
    setChartData(result)
    const map = mapHistory(result)
    const options = getOptions(map, result, isXSmall, theme.palette.mode)
    setChartOptions(options)
    setIsLoading(false)
  }
  const chartMap = mapHistory(history)
  const opts = getOptions(chartMap, history, isXSmall, theme.palette.mode)
  const emptyOps = getOptions({ x: [], y: [] }, [], isXSmall, theme.palette.mode)

  const [chartOptions, setChartOptions] = React.useState<ApexOptions | null>(opts)
  const [chartData, setChartData] = React.useState(history)

  React.useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <Box>
      <Box textAlign={'right'} pr={1} pt={1}>
        <DropdownList options={stockChartDaySelect} selectedOption={'90'} onOptionSelected={handleDaysSelected} />
      </Box>

      <>
        {companyName && (
          <CenterStack>
            <Typography variant='h5' color='primary' sx={{ textAlign: 'center' }}>
              {companyName}
            </Typography>
          </CenterStack>
        )}
        {isLoading ? (
          <>
            <BackdropLoader />
            <ReactApexChart series={emptyOps.series} options={emptyOps} type='area' height={chartHeight} />
          </>
        ) : (
          <>
            {chartOptions && (
              <Box minHeight={{ xs: 300, sm: chartHeight }} pt={2}>
                <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' height={chartHeight} />

                <Box display='flex' gap={4} pb={4}>
                  <Box display='flex' gap={1}>
                    <Typography variant='caption'>start date:</Typography>
                    <Typography variant='caption'>{dayjs(chartData[0].TradeDate).format('MM/DD/YYYY')}</Typography>
                  </Box>
                  {chartData.length > 0 && (
                    <Box display='flex' gap={1}>
                      <Typography variant='caption'>end date:</Typography>
                      <Typography variant='caption'>{dayjs(chartData[chartData.length - 1].TradeDate).format('MM/DD/YYYY')}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </>
        )}
      </>
    </Box>
  )
}

export default StockChart
