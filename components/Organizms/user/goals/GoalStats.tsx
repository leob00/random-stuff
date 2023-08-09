import { Stack, Box, Typography } from '@mui/material'
import { CasinoRedTransparent } from 'components/themes/mainTheme'
import { UserGoal, UserGoalStats } from 'lib/models/userTasks'
import React from 'react'

const GoalStats = ({ goal, stats }: { goal: UserGoal; stats: UserGoalStats }) => {
  return (
    <Stack>
      <Box display={'flex'} gap={1}>
        <Box width={100} justifyContent={'flex-end'}>
          <Typography variant='body2' textAlign={'right'}>
            count:
          </Typography>
        </Box>
        <Box>
          <Typography variant='body2'>{`${Number(stats.completed) + Number(stats.inProgress)}`}</Typography>
        </Box>
      </Box>
      {!goal.deleteCompletedTasks && (
        <Box display={'flex'} gap={1}>
          <Box width={100} justifyContent={'flex-end'}>
            <Typography variant='body2' textAlign={'right'}>
              completed:
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2'>{`${stats.completed}`}</Typography>
          </Box>
        </Box>
      )}
      <Box display={'flex'} gap={1}>
        <Box width={100} justifyContent={'flex-end'}>
          <Typography variant='body2' textAlign={'right'}>
            started:
          </Typography>
        </Box>
        <Box>
          <Typography variant='body2'>{`${stats.inProgress}`}</Typography>
        </Box>
      </Box>
      {stats.pastDue > 0 && (
        <Box display={'flex'} gap={1}>
          <Box width={100} justifyContent={'flex-end'}>
            <Typography variant='body2' textAlign={'right'} color={CasinoRedTransparent}>
              past due:
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color={CasinoRedTransparent}>{`${stats.pastDue}`}</Typography>
          </Box>
        </Box>
      )}
    </Stack>
  )
}

export default GoalStats
