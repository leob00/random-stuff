import Search from '@mui/icons-material/Search'
import SearchOff from '@mui/icons-material/SearchOff'
import { Box, IconButton, Stack, Switch, Typography } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import ConfirmDialog from 'components/Atoms/Dialogs/ConfirmDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import PageWithGridSkeleton from 'components/Atoms/Skeletons/PageWithGridSkeleton'
import AddTaskForm from 'components/Molecules/Forms/AddTaskForm'
import EditTaskForm from 'components/Molecules/Forms/EditTaskForm'
import { CasinoRedTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { constructUserTaskPk } from 'lib/backend/api/aws/util'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { replaceItemInArray } from 'lib/util/collections'
import { getUtcNow } from 'lib/util/dateUtil'
import React from 'react'
import TaskItem from './TaskItem'
import { reorderTasks } from './UserGoalsLayout'

interface TaskModel {
  isLoading: boolean
  //tasks: UserTask[]
  ///filteredTasks: UserTask[]
  editTask?: UserTask
  selectedTask?: UserTask
  confirmCompleteTask: boolean
  showSearch: boolean
}

const TaskList = ({
  username,
  selectedGoal,
  tasks,
  onAddTask,
  onModifyTask,
  onDeleteTask,
  disabled = false,
}: {
  username: string
  selectedGoal: UserGoal
  tasks: UserTask[]
  onAddTask: (item: UserTask) => void
  onModifyTask: (item: UserTask) => void
  onDeleteTask: (item: UserTask) => void
  disabled?: boolean
}) => {
  let defaultTasks = selectedGoal.deleteCompletedTasks ? [...tasks].filter((m) => m.status !== 'completed') : [...tasks]
  const [model, setModel] = React.useReducer((state: TaskModel, newState: TaskModel) => ({ ...state, ...newState }), {
    isLoading: false,
    //tasks: defaultTasks,
    confirmCompleteTask: false,
    //filteredTasks: defaultTasks,
    showSearch: false,
  })

  const handleAddTask = (item: UserTask) => {
    item.status = 'in progress'
    item.goalId = selectedGoal.id
    item.id = constructUserTaskPk(username)
    const tasksCopy = [...tasks]
    tasksCopy.push(item)
    const reordered = reorderTasks(tasksCopy)
    defaultTasks = reordered
    setModel({ ...model, isLoading: false })
    onAddTask(item)
  }
  const handleTaskClick = (item: UserTask) => {
    setModel({ ...model, editTask: item })
  }
  const handleSaveTask = async (item: UserTask) => {
    if (item.status && item.status === 'completed') {
      item.dateCompleted = getUtcNow().format()
      item.status = 'completed'
    } else {
      item.dateCompleted = undefined
      item.status = 'in progress'
    }
    item.dateModified = getUtcNow().format()
    let tasksCopy = tasks.filter((e) => e.id !== item.id)
    tasksCopy.push(item)
    if (selectedGoal.deleteCompletedTasks) {
      tasksCopy = tasksCopy.filter((m) => m.status !== 'completed')
    }
    const reordered = reorderTasks(tasksCopy)
    defaultTasks = reordered

    setModel({ ...model, isLoading: false, editTask: undefined, selectedTask: undefined })
    onModifyTask(item)
  }

  const handleYesChangeTaskStatus = () => {}
  const handleNoChangeTaskStatus = () => {
    const tasksCopy = [...tasks]
    if (model.selectedTask !== undefined) {
      tasksCopy.forEach((task) => {
        if (task.id === model.selectedTask!.id) {
          task.status = model.selectedTask!.status == 'in progress' ? 'completed' : 'in progress'
        }
      })
    }
    defaultTasks = tasksCopy

    setModel({ ...model, confirmCompleteTask: false, selectedTask: undefined, editTask: undefined })
  }

  const handleCompleteTaskClick = async (checked: boolean, item: UserTask) => {
    //setModel({ ...model, isLoading: true })
    const itemCopy = { ...item }
    itemCopy.status = checked ? 'completed' : 'in progress'

    await handleSaveTask(itemCopy)
    onModifyTask(itemCopy)
  }

  const handleSearched = (text: string) => {
    if (text.length === 0) {
      defaultTasks = [...tasks]
      return
    }
    const filtered: UserTask[] = tasks.filter((e) => {
      return e.body?.toLocaleLowerCase().includes(text.toLocaleLowerCase())
    })
    defaultTasks = filtered
  }

  const handleToggleSearch = () => {
    setModel({ ...model, showSearch: !model.showSearch })
  }
  const handleDeleteTask = (item: UserTask) => {
    const newTasks = [...tasks].filter((m) => m.id !== item.id)
    defaultTasks = newTasks
    setModel({ ...model, editTask: undefined })
    onDeleteTask({ ...item })
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
        <Box pl={2}>
          <IconButton size='small' color='secondary' onClick={handleToggleSearch}>
            {model.showSearch ? <SearchOff fontSize='small' /> : <Search fontSize='small' />}
          </IconButton>
        </Box>
      </Box>
      {model.isLoading ? (
        <>
          <PageWithGridSkeleton />
        </>
      ) : (
        <>
          {model.showSearch ? (
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} pb={2}>
              <SearchWithinList text={'search tasks'} onChanged={handleSearched} />
            </Stack>
          ) : (
            <Box pt={1} pb={3}>
              <AddTaskForm task={{}} onSubmitted={handleAddTask} />
            </Box>
          )}
          {defaultTasks.length === 0 && tasks.length > 0 && (
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
              <Typography textAlign={'center'}>0 tasks found</Typography>
            </Stack>
          )}
          {defaultTasks.map((item, i) => (
            <Box key={item.id}>
              {model.editTask !== undefined && model.editTask.id === item.id ? (
                <Box>
                  <EditTaskForm
                    task={model.editTask}
                    onSubmit={handleSaveTask}
                    onCancel={() => {
                      setModel({ ...model, editTask: undefined, selectedTask: undefined })
                    }}
                    onDelete={handleDeleteTask}
                  />
                </Box>
              ) : (
                <>
                  <Box pb={2}>
                    <Box key={item.id}>
                      <TaskItem
                        task={item}
                        index={i}
                        taskCount={tasks.length}
                        handleCompleteTaskClick={handleCompleteTaskClick}
                        handleTaskClick={handleTaskClick}
                      />
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          ))}
        </>
      )}
    </>
  )
}

export default TaskList
