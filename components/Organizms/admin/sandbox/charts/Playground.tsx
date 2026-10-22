import { Box } from '@mui/material'
import BasicLineChartExample from 'components/Atoms/Charts/chartJs/BasicLineChartExample'
import MultiLineChartDisplay from '../../../sandbox/MultiLineChartDisplay'

const Playground = () => {
  const max = 10

  return (
    <Box py={2}>
      <Box height={500}>
        <BasicLineChartExample />
      </Box>
      <Box height={500}>
        <MultiLineChartDisplay />
      </Box>
    </Box>
  )
}

export default Playground
