import { Box, Checkbox, Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import ConfirmDialog from 'components/Atoms/Dialogs/ConfirmDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import WarmupBox from 'components/Atoms/WarmupBox'
import AddTaskForm from 'components/Molecules/Forms/AddTaskForm'
import EditTaskForm from 'components/Molecules/Forms/EditTaskForm'
import dayjs from 'dayjs'
import { constructUserTaskPk } from 'lib/backend/api/aws/util'
import { UserTask } from 'lib/models/userTasks'
import { getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, filter, orderBy } from 'lodash'
import React from 'react'

interface TaskModel {
  isLoading: boolean
  tasks: UserTask[]
  editTask?: UserTask
  selectTask2?: UserTask
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
  //const [isLoading, setIsLoading] = React.useState(true)
  const [model, setModel] = React.useReducer((state: TaskModel, newState: TaskModel) => ({ ...state, ...newState }), {
    isLoading: true,
    tasks: [],
    confirmCompleteTask: false,
  })

  const handleAddTask = (item: UserTask) => {
    item.goalId = goalId
    item.id = constructUserTaskPk(username)

    onAddTask(item)
  }
  const handleTaskClick = (item: UserTask) => {
    setModel({ ...model, editTask: item })
  }
  const handleSaveTask = (item: UserTask) => {
    setModel({ ...model, isLoading: true, confirmCompleteTask: false })
    if (item.status && item.status === 'completed') {
      item.dateCompleted = getUtcNow().format()
    } else {
      item.dateCompleted = undefined
    }
    item.dateModified = getUtcNow().format()
    const tasks = filter(cloneDeep(model.tasks), (e) => e.id !== item.id)
    tasks.push(item)
    setModel({ ...model, isLoading: false, tasks: orderBy(tasks, ['dueDate', 'status'], ['asc', 'desc']), editTask: undefined, selectTask2: undefined })

    onModifyTask(item)
  }

  const handleYesChangeTaskStatus = () => {}
  const handleNoChangeTaskStatus = () => {
    const tasks = cloneDeep(model.tasks)
    if (model.selectTask2 !== undefined) {
      tasks.forEach((task) => {
        if (task.id === model.selectTask2!.id) {
          task.status = model.selectTask2!.status == 'in progress' ? 'completed' : 'in progress'
        }
      })
    }
    setModel({ ...model, confirmCompleteTask: false, selectTask2: undefined, editTask: undefined, tasks: tasks })
  }

  const handleCompleteTaskClick = (checked: boolean, item: UserTask) => {
    item.status = checked ? 'completed' : 'in progress'
    /* if (checked) {
      setModel({ ...model, confirmCompleteTask: true, selectTask2: item })
      return
    } */

    handleSaveTask(item)
  }

  React.useEffect(() => {
    setModel({ ...model, isLoading: false })
  }, [])
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
        <WarmupBox />
      ) : (
        <>
          {tasks.length === 0 && (
            <Box py={1}>
              <AddTaskForm task={{}} onSubmit={handleAddTask} />
            </Box>
          )}
          {tasks.map((item, i) => (
            <Box key={i}>
              {model.editTask !== undefined && model.editTask.id === item.id ? (
                <Box>
                  <EditTaskForm
                    task={model.editTask}
                    onSubmit={handleSaveTask}
                    onCancel={() => {
                      setModel({ ...model, editTask: undefined, selectTask2: undefined })
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
                      <Checkbox
                        checked={item.status === 'completed'}
                        onChange={(e, checked: boolean) => {
                          handleCompleteTaskClick(checked, item)
                        }}
                      />
                    </Stack>
                  </Stack>
                  {item.dueDate && <Typography variant='body2'>{`due: ${dayjs(item.dueDate).format('MM/DD/YYYY hh:mm A')}`}</Typography>}
                  {i < tasks.length - 1 && <HorizontalDivider />}
                </Box>
              )}
            </Box>
          ))}
          {tasks.length > 0 && !model.editTask && (
            <Box pt={8} pb={2}>
              <AddTaskForm task={{}} onSubmit={handleAddTask} />
            </Box>
          )}
        </>
      )}
    </>
  )
}

export default TaskList
