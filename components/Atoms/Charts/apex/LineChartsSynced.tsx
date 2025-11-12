import dynamic from 'next/dynamic'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { getBaseLineChartOptions, LineChartOptions } from 'components/Atoms/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'

import FadeIn from 'components/Atoms/Animations/FadeIn'
import FadeOut from 'components/Atoms/Animations/FadeOut'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import dayjs from 'dayjs'
import { CasinoBlackTransparent, VeryLightBlue } from 'components/themes/mainTheme'

const getOptions = (xYValues: XyValues[], lineOptions: LineChartOptions[]) => {
  const result: ApexOptions[] = xYValues.map((m, i) => getBaseLineChartOptions(m, lineOptions[i]))
  return result
}

const LineChartsSynced = ({ xYValues, lineOptions, isLoading }: { xYValues: XyValues[]; lineOptions: LineChartOptions[]; isLoading: boolean }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const chartHeight = isXSmall ? 300 : 520

  const options = getOptions(xYValues, lineOptions)

  options[0].xaxis! = { ...options[0].xaxis, type: 'datetime', axisTicks: { show: true, borderType: 'none', color: VeryLightBlue, offsetY: 1 } }
  options[0].xaxis!.labels = {
    ...options[0].xaxis!.labels,
    show: true,
    rotate: 340,
    rotateAlways: true,

    formatter: (val, timestamp, opts) => {
      return dayjs(val).format('MM/DD/YYYY')
    },
    offsetX: 4,
    offsetY: 16,

    style: {
      fontSize: '10px',
    },
  }

  options[0].grid = { ...options[0].grid }
  options[1].chart!.height = 160
  options[1].xaxis! = { ...options[1].xaxis, type: 'datetime', axisTicks: { show: false, borderType: 'none', color: VeryLightBlue } }
  options[1].xaxis!.labels = {
    ...options[1].xaxis!.labels,
    show: false,
    formatter: (val, timestamp, opts) => {
      return dayjs(val).format('MM/DD/YYYY')
    },
    offsetX: 8,
    offsetY: 2,
  }

  return (
    <Box height={chartHeight + 190}>
      {isLoading ? (
        <Box minHeight={chartHeight + 160}></Box>
      ) : (
        <>
          {options.length > 1 && (
            <Box minHeight={chartHeight + options[1].chart!.height}>
              <FadeIn>
                <Box minHeight={chartHeight}>
                  <ReactApexChart options={options[0]} series={options[0].series} type='area' height={'100%'} />
                </Box>
                <Box height={160} pt={2}>
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
