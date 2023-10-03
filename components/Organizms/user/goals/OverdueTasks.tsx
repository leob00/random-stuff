import { Box, Typography, useTheme } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import ListItemContainer from 'components/Molecules/Lists/ListItemContainer'
import { RedDarkMode, CasinoRedTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { UserTask } from 'lib/models/userTasks'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import TaskItem from './TaskItem'
import TaskList from './TaskList'
import { UserGoalAndTask } from './UserGoalsLayout'
import { useRouter } from 'next/navigation'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'

const OverdueTasks = ({ goalsAndTasks, username }: { goalsAndTasks: UserGoalAndTask[]; username: string }) => {
  const theme = useTheme()
  const redColor = theme.palette.mode === 'dark' ? RedDarkMode : CasinoRedTransparent
  const router = useRouter()

  const all = goalsAndTasks.flatMap((m) => m.tasks)
  const overdue = sortArray(
    all.filter((m) => m.status !== 'completed' && m.dueDate && dayjs(m.dueDate).isBefore(dayjs())),
    ['dueDate'],
    ['asc'],
  )
  const handleCompleteTaskClick = (checked: boolean, task: UserTask) => {}
  const handleTaskClick = (item: UserTask) => {
    const goalId = encodeURIComponent(weakEncrypt(item.goalId!))
    const token = encodeURIComponent(weakEncrypt(username))
    router.push(`/protected/csr/goals/details?id=${goalId}&token=${token}`)
  }
  return (
    <>
      {overdue.length > 0 && (
        <Box>
          <CenteredHeader title='Overdue Tasks' />
          {overdue.map((item, i) => (
            <Box key={item.id} py={2}>
              <ListItemContainer>
                <Box py={2}>
                  <Box pl={2}>
                    <LinkButton2
                      onClick={() => {
                        handleTaskClick(item)
                      }}
                    >
                      <Typography>{item.body}</Typography>
                    </LinkButton2>
                  </Box>
                  <Box pl={2}>
                    <Typography variant={'caption'}>{`due: ${dayjs(item.dueDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
                  </Box>
                </Box>
              </ListItemContainer>

              {/* <TaskItem task={item} index={i} taskCount={overdue.length} handleCompleteTaskClick={handleCompleteTaskClick} handleTaskClick={handleTaskClick} /> */}
            </Box>
          ))}
        </Box>
      )}
    </>
  )
}

export default OverdueTasks
