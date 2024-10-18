import { Box, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { getBaseLineChartOptions } from 'components/Atoms/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'
import dynamic from 'next/dynamic'
import BackdropLoader from '../../Loaders/BackdropLoader'
import { useState, useEffect } from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const BasicLineChart = ({
  xyValues,
  rawData,
  height,
  yLabelPrefix = '',
  changePositiveColor = false,
  title,
  isXSmall = false,
  numericFormatter,
}: {
  xyValues: XyValues
  rawData: any[]
  height?: number
  yLabelPrefix?: string
  changePositiveColor?: boolean
  title?: string
  isXSmall?: boolean
  numericFormatter?: (num: number) => string
}) => {
  const theme = useTheme()

  let chartHeight = height ?? 580
  if (isXSmall && !height) {
    chartHeight = 240
  }

  const [chartOptions, setChartOptions] = useState<ApexOptions | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const opts = getBaseLineChartOptions(xyValues, {
      raw: rawData,
      isXSmall: isXSmall,
      palette: theme.palette.mode,
      yLabelPrefix: yLabelPrefix,
      changePositiveColor: changePositiveColor,
      numericFormatter: numericFormatter,
    })
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
        <BackdropLoader />
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
