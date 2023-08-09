import Search from '@mui/icons-material/Search'
import SearchOff from '@mui/icons-material/SearchOff'
import { Box, IconButton, Stack, Switch, Typography } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import ConfirmDialog from 'components/Atoms/Dialogs/ConfirmDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import PageWithGridSkeleton from 'components/Atoms/Skeletons/PageWithGridSkeleton'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
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
  taskList: UserTask[]
  searchTasksText: string
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
    taskList: reorderTasks(defaultTasks),
    confirmCompleteTask: false,
    searchTasksText: '',
    showSearch: false,
  })

  const handleAddTask = (item: UserTask) => {
    const newItem = { ...item }
    newItem.status = 'in progress'
    newItem.goalId = selectedGoal.id
    newItem.id = constructUserTaskPk(username)

    const tasksCopy = [...model.taskList]
    tasksCopy.unshift(newItem)
    const reordered = reorderTasks(tasksCopy)
    setModel({ ...model, searchTasksText: '', taskList: reordered })
    onAddTask(item)
  }
  const handleTaskClick = (item: UserTask) => {
    setModel({ ...model, editTask: item })
  }
  const handleSaveTask = async (item: UserTask) => {
    if (!item.id) {
      item.id = constructUserTaskPk(username)
    }
    if (item.status && item.status === 'completed') {
      item.dateCompleted = getUtcNow().format()
      item.status = 'completed'
    } else {
      item.dateCompleted = undefined
      item.status = 'in progress'
    }
    item.dateModified = getUtcNow().format()
    let tasksCopy = model.taskList.filter((e) => e.id !== item.id)
    tasksCopy.push(item)
    if (selectedGoal.deleteCompletedTasks) {
      tasksCopy = tasksCopy.filter((m) => m.status !== 'completed')
    }
    const reordered = reorderTasks(tasksCopy)

    setModel({ ...model, isLoading: false, editTask: undefined, selectedTask: undefined, taskList: reordered })
    onModifyTask(item)
  }

  const handleYesChangeTaskStatus = () => {}
  const handleNoChangeTaskStatus = () => {
    const tasksCopy = [...model.taskList]
    if (model.selectedTask !== undefined) {
      tasksCopy.forEach((task) => {
        if (task.id === model.selectedTask!.id) {
          task.status = model.selectedTask!.status == 'in progress' ? 'completed' : 'in progress'
        }
      })
    }

    setModel({ ...model, confirmCompleteTask: false, selectedTask: undefined, editTask: undefined, taskList: tasksCopy })
  }

  const handleCompleteTaskClick = async (checked: boolean, item: UserTask) => {
    //setModel({ ...model, isLoading: true })
    const itemCopy = { ...item }
    itemCopy.status = checked ? 'completed' : 'in progress'
    const fn = async () => {
      await handleSaveTask(itemCopy)
      onModifyTask(itemCopy)
    }
    setTimeout(() => {
      fn()
    }, 1000)
  }

  const filterTasks = (text: string) => {
    if (text.length === 0) {
      return [...model.taskList]
    }
    const filtered = [...model.taskList].filter((m) => m.body?.toLowerCase().includes(text.toLowerCase()))
    return filtered
  }

  const handleSearched = (text: string) => {
    setModel({ ...model, searchTasksText: text })
  }

  const handleToggleSearch = () => {
    setModel({ ...model, showSearch: !model.showSearch })
  }
  const handleDeleteTask = (item: UserTask) => {
    const newTasks = [...tasks].filter((m) => m.id !== item.id)
    defaultTasks = newTasks
    setModel({ ...model, editTask: undefined, taskList: reorderTasks(newTasks) })

    onDeleteTask({ ...item })
  }

  return (
    <>
      <ConfirmDialog onCancel={handleNoChangeTaskStatus} show={model.confirmCompleteTask} text={'complete task?'} title={'confirm'} onConfirm={handleYesChangeTaskStatus} />

      {model.isLoading ? (
        <>
          <PageWithGridSkeleton />
        </>
      ) : (
        <>
          <Box pt={1} pb={3}>
            <AddTaskForm task={{}} onSubmitted={handleAddTask} />
          </Box>

          <Box py={2}>
            <Stack direction='row' py={'3px'} justifyContent='left' alignItems='left'>
              <Box display={'flex'} alignItems={'center'} gap={2}>
                <Box>
                  <IconButton size='small' color='secondary' onClick={handleToggleSearch}>
                    {!model.showSearch ? <Search fontSize='small' /> : <SearchOff fontSize='small' />}
                  </IconButton>
                </Box>

                <Box>
                  {model.showSearch && (
                    <Stack>
                      <SearchWithinList text={'search tasks'} onChanged={handleSearched} />
                    </Stack>
                  )}
                </Box>
              </Box>
              <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'center'}>
                <Typography variant='caption'>complete</Typography>
              </Stack>
            </Stack>
            <HorizontalDivider />
          </Box>
          {model.taskList.length === 0 && (
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
              <NoDataFound message={'you do not have tasks for this goal'} />
            </Stack>
          )}
          {filterTasks(model.searchTasksText).map((item, i) => (
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
                      <TaskItem task={item} index={i} taskCount={tasks.length} handleCompleteTaskClick={handleCompleteTaskClick} handleTaskClick={handleTaskClick} />
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
