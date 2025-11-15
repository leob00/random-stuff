import { Box, Stack, Switch, Typography, useTheme } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ListItemContainer from 'components/Molecules/Lists/ListItemContainer'
import { CasinoRedTransparent, RedDarkMode } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { UserTask } from './goalModels'
import { useState } from 'react'

const TaskItem = ({
  task,
  taskCount,
  index,
  handleTaskClick,
  handleCompleteTaskClick,
}: {
  task: UserTask
  taskCount: number
  index: number
  handleTaskClick: (item: UserTask) => void
  handleCompleteTaskClick: (checked: boolean, item: UserTask) => void
}) => {
  const theme = useTheme()
  const redColor = theme.palette.mode === 'dark' ? RedDarkMode : CasinoRedTransparent
  const [isCompleted, setIsCompleted] = useState(task.status === 'completed')

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setIsCompleted(checked)
    const newTask = { ...task }
    newTask.status = checked ? 'completed' : newTask.status
    handleCompleteTaskClick(checked, newTask)
  }

  return (
    <>
      <ListItemContainer>
        <Box p={2}>
          <Box>
            <Stack direction='row' justifyContent='left' alignItems='left'>
              <LinkButton2
                onClick={() => {
                  handleTaskClick(task)
                }}
              >
                <Typography textAlign={'left'} variant='subtitle1'>
                  {`${task.body && task.body.length > 0 ? task.body : 'not set'}`}
                </Typography>
              </LinkButton2>
              <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'center'}>
                <Switch color={isCompleted ? 'success' : 'default'} checked={isCompleted} onChange={handleChecked} />
              </Stack>
            </Stack>
            {task.dueDate && (
              <Typography variant='body2' color={task.status !== 'completed' && dayjs().isAfter(task.dueDate) ? redColor : 'unset'}>{`due: ${dayjs(
                task.dueDate,
              ).format('MM/DD/YYYY hh:mm A')}`}</Typography>
            )}
            {task.dateCompleted && <Typography variant='body2'>{`completed: ${dayjs(task.dateCompleted).format('MM/DD/YYYY hh:mm A')}`}</Typography>}
            {task.files && task.files.length > 0 && (
              <Box>
                <Typography variant='caption'>{`files: ${task.files.length}`}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </ListItemContainer>
      <HorizontalDivider />
    </>
  )
}

export default TaskItem
