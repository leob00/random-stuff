import { Box, useMediaQuery } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import WarmupBox from 'components/Atoms/WarmupBox'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import theme from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { getStockChart } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import dynamic from 'next/dynamic'
import React from 'react'
import { getOptions } from './lineChartOptions'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const StockChart = ({ symbol, history }: { symbol: string; history: StockHistoryItem[] }) => {
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isMedium = useMediaQuery(theme.breakpoints.down('lg'))
  let chartHeight = 680
  if (isXSmall) {
    chartHeight = 50
  }
  if (isMedium) {
    chartHeight = 480
  }
  const mapHistory = (items: StockHistoryItem[]) => {
    const data: XyValues = {
      x: items.map((o) => dayjs(o.TradeDate).format('MM/DD/YYYY')),
      y: items.map((o) => o.Price),
    }
    return data
  }

  const daySelect: DropdownItem[] = [
    { text: '1 year', value: '365' },
    { text: '6 months', value: '180' },
    { text: '3 months', value: '90' },
    { text: '1 month', value: '30' },
    { text: '1 week', value: '7' },
  ]

  const handleDaysSelected = async (val: string) => {
    const result = await getStockChart(symbol, Number(val))
    const map = mapHistory(result)
    const options = getOptions(map, result, isXSmall)
    setChartOptions(options)
  }
  const [chartOptions, setChartOptions] = React.useState<ApexOptions | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const map = mapHistory(history)
    setChartOptions(getOptions(map, history, isXSmall))
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <Box textAlign={'right'} pr={1} pt={1} pb={2}>
        <DropdownList options={daySelect} selectedOption={'90'} onOptionSelected={handleDaysSelected} />
      </Box>
      {isLoading ? (
        <Box minHeight={300}>
          <WarmupBox text='loading chart...' />
        </Box>
      ) : (
        <>
          {chartOptions && (
            <Box
              borderRadius={3}
              p={1}
              // sx={{ backgroundColor: VeryLightBlueTransparent }}
            >
              <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' height={chartHeight} />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default StockChart
