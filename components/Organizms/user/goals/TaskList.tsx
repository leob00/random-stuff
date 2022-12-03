import { Box, Checkbox, Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import WarmupBox from 'components/Atoms/WarmupBox'
import AddTaskForm from 'components/Molecules/Forms/AddTaskForm'
import EditTaskForm from 'components/Molecules/Forms/EditTaskForm'
import { constructUserTaskPk } from 'lib/backend/api/aws/util'
import { UserTask } from 'lib/models/userTasks'
import { getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, filter, orderBy } from 'lodash'
import React from 'react'

interface TaskModel {
  isLoading: boolean
  tasks: UserTask[]
  selectedTask?: UserTask
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
  const [model, setModel] = React.useReducer((state: TaskModel, newState: TaskModel) => ({ ...state, ...newState }), { isLoading: true, tasks: [] })

  const handleAddTask = (item: UserTask) => {
    item.goalId = goalId
    item.id = constructUserTaskPk(username)

    onAddTask(item)
  }
  const handleTaskClick = (item: UserTask) => {
    setModel({ ...model, selectedTask: item })
  }
  const handleSaveTask = (item: UserTask) => {
    setModel({ ...model, isLoading: true })
    //console.log('saving: ', JSON.stringify(item))
    item.dateModified = getUtcNow().format()
    const tasks = filter(cloneDeep(model.tasks), (e) => e.id !== item.id)
    tasks.push(item)

    onModifyTask(item)
    setModel({ ...model, isLoading: false, tasks: orderBy(tasks, ['dueDate', 'status'], ['asc', 'desc']), selectedTask: undefined })
  }

  const handleCheckCompleteTask = (checked: boolean, item: UserTask) => {
    item.status = checked ? 'completed' : 'in progress'
    setModel({ ...model, selectedTask: undefined })
    onModifyTask(item)
  }
  React.useEffect(() => {
    setModel({ ...model, isLoading: false })
  }, [])
  return (
    <>
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
              {model.selectedTask !== undefined && model.selectedTask.id === item.id ? (
                <Box>
                  <EditTaskForm
                    task={model.selectedTask}
                    onSubmit={handleSaveTask}
                    onCancel={() => {
                      setModel({ ...model, selectedTask: undefined })
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
                        defaultChecked={item.status === 'completed'}
                        onChange={(e, checked: boolean) => {
                          handleCheckCompleteTask(checked, item)
                        }}
                      />
                    </Stack>
                  </Stack>
                  {i < tasks.length - 1 && <HorizontalDivider />}
                </Box>
              )}
            </Box>
          ))}
          {tasks.length > 0 && !model.selectedTask && (
            <Box pt={2} pb={2}>
              <AddTaskForm task={{}} onSubmit={handleAddTask} />
            </Box>
          )}
        </>
      )}
    </>
  )
}

export default TaskList
