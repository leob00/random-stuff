import { Stack, Box, Typography, useTheme } from '@mui/material'
import { CasinoRedTransparent, RedDarkMode } from 'components/themes/mainTheme'
import { UserGoal, UserGoalStats } from 'lib/models/userTasks'
import React from 'react'
import GoalProgressBar from './GoalProgressBar'

const GoalStats = ({ stats, completePercent }: { stats: UserGoalStats; completePercent?: number }) => {
  const theme = useTheme()
  const redColor = theme.palette.mode === 'dark' ? RedDarkMode : CasinoRedTransparent
  return (
    <Box>
      <Box display={'flex'} gap={1} alignItems={'flex-start'} py={2}>
        <Box width={100} justifyContent={'flex-end'}>
          <Typography variant='body2' textAlign={'right'}>
            tasks:
          </Typography>
        </Box>
        <Box>
          <Typography variant='body2'>{`${Number(stats.completed) + Number(stats.inProgress)}`}</Typography>
        </Box>
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
      </Box>

      {completePercent && (
        <Box py={1}>
          <GoalProgressBar completePercent={completePercent} />
        </Box>
      )}
    </Box>
  )
}

export default GoalStats
