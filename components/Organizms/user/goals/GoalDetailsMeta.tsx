import { Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { UserGoal } from 'lib/models/userTasks'
import React from 'react'

const GoalDetailsMeta = ({ goal }: { goal: UserGoal }) => {
  return (
    <Stack>
      {goal.dueDate && (
        <>
          <Typography variant='body2'>due date:</Typography>
          <Typography variant='body2' fontWeight={600}>
            {dayjs(goal.dueDate).format('MM/DD/YYYY hh:mm A')}
          </Typography>
        </>
      )}
      <Typography variant='body2'>created:</Typography>
      <Typography variant='body2' fontWeight={600}>
        {dayjs(goal.dateCreated).format('MM/DD/YYYY hh:mm A')}
      </Typography>
      <Typography variant='body2'>modified:</Typography>
      <Typography variant='body2' fontWeight={600}>
        {dayjs(goal.dateModified).format('MM/DD/YYYY hh:mm A')}
      </Typography>
      {/* <Typography variant='body2' py={1}>
        progress:
      </Typography>
      <Stack py={1}>
        <ProgressBar value={goal.completePercent ?? 0} />
      </Stack> */}
    </Stack>
  )
}

export default GoalDetailsMeta
