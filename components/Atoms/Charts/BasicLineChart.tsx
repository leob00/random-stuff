import { Box, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import WarmupBox from 'components/Atoms/WarmupBox'
import { getBaseLineChartOptions } from 'components/Molecules/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { getOptions } from 'components/Organizms/stocks/lineChartOptions'
import dynamic from 'next/dynamic'
import React from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const BasicLineChart = ({
  xyValues,
  rawData,
  height,
  yLabelPrefix = '',
  changePositiveColor = false,
  title,
  isXSmall = false,
}: {
  xyValues: XyValues
  rawData: any[]
  height?: number
  yLabelPrefix?: string
  changePositiveColor?: boolean
  title?: string
  isXSmall?: boolean
}) => {
  const theme = useTheme()

  let chartHeight = height ?? 580
  if (isXSmall && !height) {
    chartHeight = 240
  }

  const [chartOptions, setChartOptions] = React.useState<ApexOptions | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const opts = getBaseLineChartOptions(xyValues, rawData, isXSmall, theme.palette.mode, yLabelPrefix, undefined, changePositiveColor)
    if (title) {
      opts.title = {
        text: title,
        align: 'center',

        style: {
          fontSize: isXSmall ? '12px' : undefined,
          fontWeight: 10,
        },
      }
    }
    setChartOptions(opts)
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
            <Box>
              <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' height={chartHeight} />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default BasicLineChart
