import { Box, Stack, Typography } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { CasinoRedTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getUserGoals, putUserGoals, putUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { replaceItemInArray } from 'lib/util/collections'
import { getSecondsFromEpoch, getUtcNow } from 'lib/util/dateUtil'
import { calculatePercentInt } from 'lib/util/numberUtil'
import { filter, orderBy } from 'lodash'
import React from 'react'
import TaskList from './TaskList'
import { reorderTasks } from './UserGoalsLayout'
import { ListItemIcon, ListItemText } from '@mui/material'
import Delete from '@mui/icons-material/Delete'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import { useRouter } from 'next/router'

const SingleGoalDisplay = ({
  username,
  goal,
  tasks,
  onMutated,
  onDeleted,
}: {
  username: string
  goal: UserGoal
  tasks: UserTask[]
  onMutated: (goal: UserGoal, tasks: UserTask[]) => void
  onDeleted: (goal: UserGoal) => void
}) => {
  const [goalEditMode, setGoalEditMode] = React.useState(false)
  const [showDeleteGoalConfirm, setShowDeleteGoalConfirm] = React.useState(false)
  const router = useRouter()

  const handleAddTask = async (item: UserTask) => {
    let newTasks = [...tasks]
    const newGoal = { ...goal }
    newTasks.push(item)
    newTasks = reorderTasks(newTasks)
    await putUserGoalTasks(username, newGoal.id!, newTasks)
    const resultGoal = await saveGoal(newGoal, newTasks)
    onMutated(resultGoal, newTasks)
  }
  const handleDeleteTask = async (item: UserTask) => {
    let newTasks = tasks.filter((m) => m.id !== item.id)
    await putUserGoalTasks(username, goal.id!, newTasks)
    const resultGoal = await saveGoal(goal, newTasks)
    onMutated(resultGoal, newTasks)
  }
  const handleModifyTask = async (item: UserTask) => {
    let newTasks = [...tasks]
    replaceItemInArray(item, newTasks, 'id', item.id!)
    newTasks = reorderTasks(newTasks)
    const resultGoal = await saveGoal(goal, newTasks)
    onMutated(resultGoal, newTasks)
  }

  const saveGoal = async (goal: UserGoal, tasks: UserTask[]) => {
    const goalCopy = { ...goal }
    goalCopy.dateModified = dayjs().format()
    goalCopy.stats = getGoalStats(tasks)
    if (tasks.length > 0) {
      const completed = filter(tasks, (e) => e.status === 'completed')
      goalCopy.completePercent = calculatePercentInt(completed.length, tasks.length)
    } else {
      goalCopy.completePercent = 0
    }
    let goals = await getUserGoals(constructUserGoalsKey(username))
    replaceItemInArray(goalCopy, goals, 'id', goalCopy.id!)
    goals = orderBy(goals, ['dateModified'], ['desc'])
    await putUserGoals(constructUserGoalsKey(username), goals)
    return goalCopy
  }

  const handleDeleteGoal = async () => {
    setShowDeleteGoalConfirm(false)
    let goals = await getUserGoals(constructUserGoalsKey(username))
    const newGoals = goals.filter((m) => m.id !== goal.id)
    await putUserGoals(constructUserGoalsKey(username), newGoals)
    await putUserGoalTasks(username, goal.id!, [], getSecondsFromEpoch())
    onDeleted(goal)
    setTimeout(() => {
      router.push('/protected/csr/goals')
    }, 1000)
  }

  const contextMenu: ContextMenuItem[] = [
    {
      item: <ContextMenuEdit />,
      fn: () => setGoalEditMode(true),
    },
    {
      item: (
        <>
          <ListItemIcon>
            <Delete color='error' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='delete' />
        </>
      ),
      fn: () => setShowDeleteGoalConfirm(true),
    },
  ]

  return (
    <>
      <Box py={2} display='flex' justifyContent='space-between' alignItems={'flex-start'}>
        <Box>
          {goal.stats && (
            <>
              <Typography variant='body2'>{`tasks: ${Number(goal.stats.completed) + Number(goal.stats.inProgress)}`}</Typography>
              <Typography variant='body2'>{`completed: ${goal.stats.completed}`}</Typography>
              <Typography variant='body2'>{`started: ${goal.stats.inProgress}`}</Typography>
              {goal.stats.pastDue > 0 && <Typography variant='body2' color={CasinoRedTransparent}>{`past due: ${goal.stats.pastDue}`}</Typography>}
            </>
          )}
          {goal.completePercent !== undefined && (
            <Box display={'flex'} gap={2} alignItems={'center'}>
              <Typography variant='body2'>progress: </Typography>
              <ProgressBar value={goal.completePercent} toolTipText={`${goal.completePercent}% complete`} width={120} />
            </Box>
          )}
        </Box>
        <Box>
          <ContextMenu items={contextMenu} />
        </Box>
      </Box>
      <HorizontalDivider />
      <TaskList
        username={username}
        selectedGoal={goal}
        tasks={tasks}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onModifyTask={handleModifyTask}
      />
      <ConfirmDeleteDialog
        show={showDeleteGoalConfirm}
        text={`Are you sure you want to delete ${goal.body} and all of its tasks?`}
        onConfirm={handleDeleteGoal}
        onCancel={() => setShowDeleteGoalConfirm(false)}
      />
    </>
  )
}

export default SingleGoalDisplay
