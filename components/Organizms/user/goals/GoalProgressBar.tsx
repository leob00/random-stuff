import { Box, Typography } from '@mui/material'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'

const GoalProgressBar = ({ completePercent }: { completePercent: number }) => {
  return (
    <Box display={'flex'} gap={1} alignItems={'center'}>
      <Box width={100} justifyContent={'flex-end'}>
        <Typography variant='body2' textAlign={'right'}>
          progress:
        </Typography>
      </Box>
      <Box>
        <ProgressBar value={completePercent} toolTipText={`${completePercent}% complete`} width={160} />
      </Box>
    </Box>
  )
}

export default GoalProgressBar
