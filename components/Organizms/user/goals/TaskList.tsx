import { Box, Stack } from '@mui/material'
import ConfirmDialog from 'components/Atoms/Dialogs/ConfirmDialog'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import AddTaskForm from 'components/Molecules/Forms/AddTaskForm'
import { constructUserTaskPk } from 'lib/backend/api/aws/util'
import { getUtcNow } from 'lib/util/dateUtil'
import TaskItem from './TaskItem'
import { reorderTasks } from './UserGoalsLayout'
import dayjs from 'dayjs'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { UserTask, UserGoal } from './goalModels'
import EditTaskForm from './tasks/EditTaskForm'
import { useReducer } from 'react'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import TaskListHeader from './tasks/TaskListHeader'
import { postBody } from 'lib/backend/api/fetchFunctions'

export interface TaskModel {
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
  onModifyTask: (item: UserTask, closeEdit?: boolean) => void
  onDeleteTask: (item: UserTask) => void
  disabled?: boolean
}) => {
  let defaultTasks = selectedGoal.deleteCompletedTasks ? [...tasks].filter((m) => m.status !== 'completed') : [...tasks]
  const [model, setModel] = useReducer((state: TaskModel, newState: TaskModel) => ({ ...state, ...newState }), {
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
  const handleSaveTask = async (item: UserTask, closeEdit: boolean = true) => {
    if (!item.id) {
      item.id = constructUserTaskPk(username)
    }
    if (item.status && item.status === 'completed') {
      item.dateCompleted = !item.dateCompleted ? getUtcNow().format() : item.dateCompleted
      item.status = 'completed'
    } else {
      item.status = 'in progress'
    }
    item.dateModified = getUtcNow().format()
    let tasksCopy = model.taskList.filter((e) => e.id !== item.id)

    tasksCopy.push(item)
    if (selectedGoal.deleteCompletedTasks) {
      tasksCopy = tasksCopy.filter((m) => m.status !== 'completed')
      if (item.status === 'completed') {
        if (item.files && item.files.length > 0) {
          for (const f of item.files) {
            await postBody('/api/aws/s3/item', 'DELETE', f)
          }
        }
      }
    }
    const reordered = reorderTasks(tasksCopy)

    setModel({ ...model, isLoading: false, editTask: closeEdit ? undefined : item, selectedTask: closeEdit ? undefined : item, taskList: reordered })
    onModifyTask(item, closeEdit)
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
    setModel({ ...model, searchTasksText: text, editTask: undefined })
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
    <Box minHeight={800}>
      {model.isLoading && <BackdropLoader />}
      {model.editTask && (
        <EditTaskForm
          task={model.editTask}
          onSubmit={handleSaveTask}
          onCancel={() => {
            setModel({ ...model, editTask: undefined, selectedTask: undefined })
          }}
          onDelete={handleDeleteTask}
        />
      )}
      {!model.editTask && (
        <>
          <Box pt={1} pb={3}>
            <FadeIn>
              <AddTaskForm task={{}} onSubmitted={handleAddTask} />
            </FadeIn>
          </Box>

          {model.taskList.length === 0 && (
            <Stack direction={'row'} justifyContent={'center'} minHeight={200}>
              <NoDataFound message={`${selectedGoal.body} tasks: 0`} />
            </Stack>
          )}
          {model.taskList.length > 0 && (
            <Box minHeight={450}>
              <Box py={2}>
                <TaskListHeader
                  model={model}
                  handleDownloadToFile={handleDownloadToFile}
                  handleSearched={handleSearched}
                  handleToggleSearch={handleToggleSearch}
                />
              </Box>
              {filterTasks(model.searchTasksText).map((item, i) => (
                <Box key={item.id}>
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
                </Box>
              ))}
            </Box>
          )}
          {selectedGoal.deleteCompletedTasks && (
            <Box pt={8}>
              <Box display={'flex'} alignItems={'center'} gap={1} justifyContent={'center'}>
                <AlertWithHeader severity='warning' text='completed tasks will be deleted' />
              </Box>
            </Box>
          )}
        </>
      )}

      <ConfirmDialog
        onCancel={handleNoChangeTaskStatus}
        show={model.confirmCompleteTask}
        text={'complete task?'}
        title={'confirm'}
        onConfirm={handleYesChangeTaskStatus}
      />
    </Box>
  )
}

export default TaskList
