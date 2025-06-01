import dynamic from 'next/dynamic'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { getBaseLineChartOptions, LineChartOptions } from 'components/Atoms/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'

import FadeIn from 'components/Atoms/Animations/FadeIn'
import FadeOut from 'components/Atoms/Animations/FadeOut'

const getOptions = (xYValues: XyValues[], lineOptions: LineChartOptions[]) => {
  const result: ApexOptions[] = xYValues.map((m, i) => getBaseLineChartOptions(m, lineOptions[i]))
  return result
}

const LineChartsSynced = ({ xYValues, lineOptions, isLoading }: { xYValues: XyValues[]; lineOptions: LineChartOptions[]; isLoading: boolean }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const chartHeight = isXSmall ? 300 : 520

  const options = getOptions(xYValues, lineOptions)
  options[1].chart!.height = 160

  return (
    <Box height={chartHeight + 190}>
      {isLoading ? (
        <FadeOut>
          <Box height={chartHeight + 160}></Box>
        </FadeOut>
      ) : (
        <>
          {options.length > 1 && (
            <Box>
              <FadeIn>
                <Box height={chartHeight}>
                  <ReactApexChart options={options[0]} series={options[0].series} type='area' height={'100%'} />
                </Box>
                <Box height={160}>
                  <ReactApexChart options={options[1]} series={options[1].series} type='area' height={'100%'} />
                </Box>
              </FadeIn>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default LineChartsSynced
