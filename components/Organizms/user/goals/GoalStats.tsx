import { Stack, Box, Typography, useTheme } from '@mui/material'
import { CasinoRedTransparent, RedDarkMode } from 'components/themes/mainTheme'
import { UserGoal, UserGoalStats } from 'lib/models/userTasks'
import React from 'react'

const GoalStats = ({ goal, stats }: { goal: UserGoal; stats: UserGoalStats }) => {
  const theme = useTheme()
  const redColor = theme.palette.mode === 'dark' ? RedDarkMode : CasinoRedTransparent
  return (
    <Stack>
      <Box display={'flex'} gap={1} alignItems={'center'}>
        <Box width={100} justifyContent={'flex-end'}>
          <Typography variant='body2' textAlign={'right'}>
            count:
          </Typography>
        </Box>
        <Box>
          <Typography variant='body2'>{`${Number(stats.completed) + Number(stats.inProgress)}`}</Typography>
        </Box>
      </Box>
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
            <Typography variant='body2' textAlign={'right'} color={redColor}>
              past due:
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color={redColor}>{`${stats.pastDue}`}</Typography>
          </Box>
        </Box>
      )}
    </Stack>
  )
}

export default GoalStats
