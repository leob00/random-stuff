import { Box, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import WarmupBox from 'components/Atoms/WarmupBox'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { getOptions } from 'components/Organizms/stocks/lineChartOptions'
import dynamic from 'next/dynamic'
import React from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const BasicLineChart = ({ xyValues, rawData }: { xyValues: XyValues; rawData: any[] }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'))
  let chartHeight = 580
  if (isXSmall) {
    chartHeight = 240
  }

  const [chartOptions, setChartOptions] = React.useState<ApexOptions | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    setChartOptions(getOptions(xyValues, rawData, isXSmall, theme.palette.mode))
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      {isLoading ? (
        <Box minHeight={320}>
          <WarmupBox text='loading chart...' />
        </Box>
      ) : (
        <>
          {chartOptions && (
            <Box
              borderRadius={3}
              p={1}
              // sx={{ backgroundColor: OceanBlueTransparent }}
            >
              <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' height={chartHeight} />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default BasicLineChart
