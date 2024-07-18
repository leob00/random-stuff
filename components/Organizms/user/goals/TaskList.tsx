import Search from '@mui/icons-material/Search'
import SearchOff from '@mui/icons-material/SearchOff'
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import ConfirmDialog from 'components/Atoms/Dialogs/ConfirmDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import AddTaskForm from 'components/Molecules/Forms/AddTaskForm'
import EditTaskForm from 'components/Molecules/Forms/EditTaskForm'
import { constructUserTaskPk } from 'lib/backend/api/aws/util'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { getUtcNow } from 'lib/util/dateUtil'
import React from 'react'
import TaskItem from './TaskItem'
import { reorderTasks } from './UserGoalsLayout'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import dayjs from 'dayjs'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import DefaultTooltip from 'components/Atoms/Tooltips/DefaultTooltip'

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
    item.status = 'in progress'
    item.goalId = selectedGoal.id
    item.id = constructUserTaskPk(username)

    const tasksCopy = [...tasks]
    tasksCopy.unshift(item)
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
      handleSaveTask(itemCopy)
      onModifyTask(itemCopy)
    }
    setTimeout(() => {
      fn()
    }, 350)
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
  const download = (data: any) => {
    const blob = new Blob([data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'download.csv')
    a.click()
  }

  const csvmaker = (data: UserTask[]) => {
    const csvRows = []
    type Keys = keyof UserTask & {}
    const headers: Keys[] = ['body', 'dueDate', 'dateCompleted', 'notes']
    csvRows.push(headers.join(','))

    data.forEach((m) => {
      csvRows.push(
        `"${m.body ?? ''}",${m.dueDate ? dayjs(m.dueDate).format('YYYY-MM-DD hh:mm A') : ''}, ${m.dateCompleted ? dayjs(m.dateCompleted).format('YYYY-MM-DD hh:mm A') : ''},"${m.notes ? m.notes.replaceAll('\n', '') : ''}",`,
      )
    })

    return csvRows.join('\n')
  }
  const handleDownloadToFile = () => {
    const data = csvmaker(model.taskList)
    download(data)
  }

  return (
    <>
      {model.isLoading ? (
        <BackdropLoader />
      ) : (
        <>
          <Box pt={1} pb={3}>
            <AddTaskForm task={{}} onSubmitted={handleAddTask} />
          </Box>

          <Box py={2}>
            <Stack direction='row' py={'3px'} justifyContent='left' alignItems='left'>
              <Box display={'flex'} alignItems={'center'} gap={2}>
                <Box>
                  <IconButton size='small' color='primary' onClick={handleToggleSearch}>
                    {!model.showSearch ? <Search fontSize='small' /> : <SearchOff fontSize='small' />}
                  </IconButton>
                  {!model.showSearch && (
                    <DefaultTooltip text={'download file'}>
                      <IconButton size='small' color='primary' onClick={handleDownloadToFile}>
                        <FileDownloadIcon fontSize='small' />
                      </IconButton>
                    </DefaultTooltip>
                  )}
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
          <ScrollableBox maxHeight={400}>
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
          </ScrollableBox>
        </>
      )}
      <ConfirmDialog
        onCancel={handleNoChangeTaskStatus}
        show={model.confirmCompleteTask}
        text={'complete task?'}
        title={'confirm'}
        onConfirm={handleYesChangeTaskStatus}
      />
    </>
  )
}

export default TaskList
