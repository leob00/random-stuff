import { Box, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { getBaseLineChartOptions, LineChartOptions } from 'components/Molecules/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import React from 'react'
import dynamic from 'next/dynamic'
import BackdropLoader from '../Loaders/BackdropLoader'
import BoxSkeleton from '../Skeletons/BoxSkeleton'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const LineChartsSynced = ({ xYValues, lineOptions, isLoading }: { xYValues: XyValues[]; lineOptions: LineChartOptions[]; isLoading: boolean }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 360 : 480
  const [allOptions, setAllOptions] = React.useState<ApexOptions[]>([])

  const emptyXValues: XyValues[] = xYValues.map((m) => {
    return {
      x: [],
      y: [],
    }
  })
  const emptyLineOptions: LineChartOptions[] = lineOptions.map((m, index) => {
    return {
      raw: [],
      isXSmall: m.isXSmall,
      palette: m.palette,
      yLabelPrefix: m.yLabelPrefix,
      seriesName: '',
      changePositiveColor: false,

      //chartId: `emptyChart${index}`,
    }
  })
  const emptyOptions: ApexOptions[] = emptyXValues.map((m, i) => getBaseLineChartOptions(m, emptyLineOptions[i]))
  const options: ApexOptions[] = xYValues.map((m, i) => getBaseLineChartOptions(m, lineOptions[i]))
  React.useEffect(() => {
    setAllOptions(options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      {isLoading ? (
        <>
          <BackdropLoader />
          {/* {emptyOptions.map((item, index) => (
            <Box key={index}>
              {item.chart && (
                <Box mt={index > 0 ? -4 : 0}>
                  <ReactApexChart options={item} series={item.series} type='area' height={index === 0 ? chartHeight : 160} />
                </Box>
              )}
            </Box>
          ))} */}
        </>
      ) : (
        <>
          {allOptions.map((item, index) => (
            <Box key={item.chart?.id}>
              {item.chart && (
                <Box mt={index > 0 ? -4 : 0}>
                  <ReactApexChart options={item} series={item.series} type='area' height={index === 0 ? chartHeight : 160} />
                </Box>
              )}
            </Box>
          ))}
        </>
      )}
    </Box>
  )
}

export default LineChartsSynced