import { Box, Typography, useTheme } from '@mui/material'
import { CasinoRedTransparent, RedDarkMode } from 'components/themes/mainTheme'
import GoalProgressBar from './GoalProgressBar'
import { UserGoal } from './goalModels'
import FadeIn from 'components/Atoms/Animations/FadeIn'

const GoalStats = ({ goal, completePercent }: { goal: UserGoal; completePercent?: number }) => {
  const theme = useTheme()
  const redColor = theme.palette.mode === 'dark' ? RedDarkMode : CasinoRedTransparent
  return (
    <>
      {goal.stats && (
        <Box>
          <Box display={'flex'} gap={1} alignItems={'flex-start'} py={2}>
            <Box width={100} justifyContent={'flex-end'}>
              <Typography variant='body2' textAlign={'right'}>
                tasks:
              </Typography>
            </Box>
            <Box>
              <Typography variant='body2'>{`${Number(goal.stats.completed) + Number(goal.stats.inProgress)}`}</Typography>
            </Box>
            {!goal.deleteCompletedTasks && (
              <Box width={100} justifyContent={'flex-end'}>
                <Typography variant='body2' textAlign={'right'}>
                  completed:
                </Typography>
              </Box>
            )}
            <Box>{!goal.deleteCompletedTasks && <Typography variant='body2'>{`${goal.stats.completed}`}</Typography>}</Box>
          </Box>
          <Box display={'flex'} gap={1}>
            {!goal.deleteCompletedTasks && (
              <Box width={100} justifyContent={'flex-end'}>
                <Typography variant='body2' textAlign={'right'}>
                  started:
                </Typography>
              </Box>
            )}
            <Box>{!goal.deleteCompletedTasks && <Typography variant='body2'>{`${goal.stats.inProgress}`}</Typography>}</Box>
            {goal.stats.pastDue > 0 && (
              <Box display={'flex'} gap={1}>
                <Box width={100} justifyContent={'flex-end'}>
                  <Typography variant='body2' textAlign={'right'} color={redColor}>
                    past due:
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body2' color={redColor}>{`${goal.stats.pastDue}`}</Typography>
                </Box>
              </Box>
            )}
          </Box>

          {!!completePercent && (
            <Box py={2}>
              <GoalProgressBar completePercent={completePercent} />
            </Box>
          )}
        </Box>
      )}
    </>
  )
}

export default GoalStats
