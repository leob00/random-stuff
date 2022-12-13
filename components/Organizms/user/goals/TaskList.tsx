import { Box, Stack, Typography } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import ConfirmDialog from 'components/Atoms/Dialogs/ConfirmDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import TextSkeleton from 'components/Atoms/Skeletons/TextSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import AddTaskForm from 'components/Molecules/Forms/AddTaskForm'
import EditTaskForm from 'components/Molecules/Forms/EditTaskForm'
import { CasinoRedTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { constructUserTaskPk } from 'lib/backend/api/aws/util'
import { UserTask } from 'lib/models/userTasks'
import { getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, filter, orderBy } from 'lodash'
import React from 'react'

interface TaskModel {
  isLoading: boolean
  tasks: UserTask[]
  filteredTasks: UserTask[]
  editTask?: UserTask
  selectedTask?: UserTask
  confirmCompleteTask: boolean
}

const TaskList = ({
  username,
  goalId,
  tasks,
  onAddTask,
  onModifyTask,
  onDeleteTask,
}: {
  username: string
  goalId: string
  tasks: UserTask[]
  onAddTask: (item: UserTask) => void
  onModifyTask: (item: UserTask) => void
  onDeleteTask: (item: UserTask) => void
}) => {
  const [model, setModel] = React.useReducer((state: TaskModel, newState: TaskModel) => ({ ...state, ...newState }), {
    isLoading: false,
    tasks: tasks,
    confirmCompleteTask: false,
    filteredTasks: tasks,
  })

  const reorderList = (list: UserTask[]) => {
    const inProg = orderBy(
      filter(tasks, (e) => e.status === 'in progress'),
      ['status', 'dueDate'],
      ['desc', 'asc'],
    )
    const completed = orderBy(
      filter(tasks, (e) => e.status === 'completed'),
      ['dateCompleted'],
      ['asc'],
    )
    const result: UserTask[] = []
    result.push(...inProg)
    result.push(...completed)
    return result
  }

  const handleAddTask = (item: UserTask) => {
    setModel({ ...model, isLoading: true })
    item.status = 'in progress'
    item.goalId = goalId
    item.id = constructUserTaskPk(username)
    const tasks = cloneDeep(model.tasks)
    tasks.push(item)
    const reordered = reorderList(tasks)
    setModel({ ...model, isLoading: false, tasks: reordered, filteredTasks: reordered })
    onAddTask(item)
  }
  const handleTaskClick = (item: UserTask) => {
    setModel({ ...model, editTask: item })
  }
  const handleSaveTask = async (item: UserTask) => {
    setModel({ ...model, isLoading: true })
    if (item.status && item.status === 'completed') {
      item.dateCompleted = getUtcNow().format()
      item.status = 'completed'
    } else {
      item.dateCompleted = undefined
      item.status = 'in progress'
    }
    item.dateModified = getUtcNow().format()
    const tasks = filter(cloneDeep(model.tasks), (e) => e.id !== item.id)
    tasks.push(item)
    const reordered = reorderList(tasks)
    setModel({ ...model, isLoading: false, tasks: reordered, filteredTasks: reordered })
    onModifyTask(item)
  }

  const handleYesChangeTaskStatus = () => {}
  const handleNoChangeTaskStatus = () => {
    const tasks = cloneDeep(model.tasks)
    if (model.selectedTask !== undefined) {
      tasks.forEach((task) => {
        if (task.id === model.selectedTask!.id) {
          task.status = model.selectedTask!.status == 'in progress' ? 'completed' : 'in progress'
        }
      })
    }
    setModel({ ...model, confirmCompleteTask: false, selectedTask: undefined, editTask: undefined, tasks: tasks })
  }

  const handleCompleteTaskClick = async (checked: boolean, item: UserTask) => {
    item.status = checked ? 'completed' : 'in progress'
    await handleSaveTask(item)
  }

  const handleSearched = (text: string) => {
    if (text.length === 0) {
      setModel({ ...model, filteredTasks: model.tasks })
      return
    }
    const filtered: UserTask[] = model.tasks.filter((e) => {
      return e.body?.toLocaleLowerCase().includes(text.toLocaleLowerCase())
    })
    setModel({ ...model, filteredTasks: filtered })
  }

  return (
    <>
      <ConfirmDialog
        onCancel={handleNoChangeTaskStatus}
        show={model.confirmCompleteTask}
        text={'complete task?'}
        title={'confirm'}
        onConfirm={handleYesChangeTaskStatus}
      />
      <Box py={2}>
        <Stack direction='row' py={'3px'} justifyContent='left' alignItems='left'>
          <Typography variant='subtitle1'>Tasks</Typography>
          <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'center'}>
            <Typography>complete</Typography>
          </Stack>
        </Stack>
        <HorizontalDivider />
      </Box>
      {model.isLoading ? (
        <>
          <WarmupBox />
          <Box py={2}>
            <TextSkeleton />
          </Box>
          <Box py={2}>
            <TextSkeleton />
          </Box>
          <Box py={2}>
            <TextSkeleton />
          </Box>
          <Box py={2}>
            <TextSkeleton />
          </Box>
          <Box py={2}>
            <TextSkeleton />
          </Box>
          <Box py={2}>
            <TextSkeleton />
          </Box>
        </>
      ) : (
        <>
          {model.tasks.length === 0 && (
            <Box py={1}>
              <AddTaskForm task={{}} onSubmit={handleAddTask} />
            </Box>
          )}
          {model.tasks.length > 3 && (
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} pb={2}>
              <SearchWithinList text={'search tasks'} onChanged={handleSearched} />
            </Stack>
          )}
          {model.filteredTasks.length === 0 && model.tasks.length > 0 && (
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
              <Typography textAlign={'center'}>0 tasks found</Typography>
            </Stack>
          )}
          {model.filteredTasks.map((item, i) => (
            <Box key={i}>
              {model.editTask !== undefined && model.editTask.id === item.id ? (
                <Box>
                  <EditTaskForm
                    task={model.editTask}
                    onSubmit={handleSaveTask}
                    onCancel={() => {
                      setModel({ ...model, editTask: undefined, selectedTask: undefined })
                    }}
                    onDelete={onDeleteTask}
                  />
                </Box>
              ) : (
                <Box>
                  <Stack key={i} direction='row' justifyContent='left' alignItems='left'>
                    <LinkButton2
                      onClick={() => {
                        handleTaskClick(item)
                      }}
                    >
                      <Typography textAlign={'left'} variant='subtitle1'>
                        {item.body}
                      </Typography>
                    </LinkButton2>
                    <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'center'}>
                      <SecondaryCheckbox
                        checked={item.status === 'completed'}
                        onChanged={(checked: boolean) => {
                          handleCompleteTaskClick(checked, item)
                        }}
                      />
                    </Stack>
                  </Stack>
                  {item.dueDate && (
                    <Typography
                      variant='body2'
                      color={item.status === 'in progress' && dayjs().isAfter(item.dueDate) ? CasinoRedTransparent : 'unset'}
                    >{`due: ${dayjs(item.dueDate).format('MM/DD/YYYY hh:mm A')}`}</Typography>
                  )}
                  {i < tasks.length - 1 && <HorizontalDivider />}
                </Box>
              )}
            </Box>
          ))}
          {tasks.length > 0 && !model.editTask && (
            <Box pt={4} pb={2}>
              <AddTaskForm task={{}} onSubmit={handleAddTask} />
            </Box>
          )}
        </>
      )}
    </>
  )
}

export default TaskList
