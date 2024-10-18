import dynamic from 'next/dynamic'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { getBaseLineChartOptions, LineChartOptions } from 'components/Molecules/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import BackdropLoader from '../Loaders/BackdropLoader'

const getOptions = (xYValues: XyValues[], lineOptions: LineChartOptions[]) => {
  const result: ApexOptions[] = xYValues.map((m, i) => getBaseLineChartOptions(m, lineOptions[i]))
  return result
}

const LineChartsSynced = ({ xYValues, lineOptions, isLoading }: { xYValues: XyValues[]; lineOptions: LineChartOptions[]; isLoading: boolean }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 300 : 520

  const options = getOptions(xYValues, lineOptions)
  options[1].chart!.height = 160

  return (
    <Box>
      {isLoading ? (
        <BackdropLoader />
      ) : (
        <Box>
          <Box height={chartHeight}>
            <ReactApexChart options={options[0]} series={options[0].series} type='area' height={'100%'} />
          </Box>
          <Box height={160}>
            <ReactApexChart options={options[1]} series={options[1].series} type='area' height={'100%'} />
          </Box>

          {/* {options.length > 1 && (
            <>
              {options.map((item, index) => (
                <Box key={index}>{item.chart && <ReactApexChart key={options[index].chart?.id} options={item} series={item.series} type='area' />}</Box>
              ))}
            </>
          )} */}
        </Box>
      )}
    </Box>
  )
}

export default LineChartsSynced
