import { Box, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { getBaseLineChartOptions, LineChartOptions } from 'components/Molecules/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import BackdropLoader from '../Loaders/BackdropLoader'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const LineChartsSynced = ({ xYValues, lineOptions, isLoading }: { xYValues: XyValues[]; lineOptions: LineChartOptions[]; isLoading: boolean }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 300 : 520
  const options = useMemo(() => {
    return getOptions(xYValues, lineOptions)
  }, [xYValues, lineOptions, isXSmall, isLoading])

  return (
    <Box>
      {isLoading ? (
        <>
          <BackdropLoader />
        </>
      ) : (
        <>
          {options &&
            options.map((item, index) => (
              <Box key={index}>
                {item.chart && (
                  <Box mt={index > 0 ? -3 : 0}>
                    <ReactApexChart key={xYValues.length} options={item} series={item.series} type='area' height={index === 0 ? chartHeight : 160} />
                  </Box>
                )}
              </Box>
            ))}
        </>
      )}
    </Box>
  )
}
const getOptions = (xYValues: XyValues[], lineOptions: LineChartOptions[]) => {
  const result: ApexOptions[] = xYValues.map((m, i) => getBaseLineChartOptions(m, lineOptions[i]))
  return result
}

export default LineChartsSynced
