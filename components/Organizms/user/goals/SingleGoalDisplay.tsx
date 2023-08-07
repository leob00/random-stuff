import { Box, Typography } from '@mui/material'
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
import { getSecondsFromEpoch } from 'lib/util/dateUtil'
import { calculatePercentInt } from 'lib/util/numberUtil'
import { filter, orderBy } from 'lodash'
import React from 'react'
import TaskList from './TaskList'
import { reorderTasks } from './UserGoalsLayout'
import { ListItemIcon, ListItemText } from '@mui/material'
import Delete from '@mui/icons-material/Delete'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import { useRouter } from 'next/router'
import EditGoal from './EditGoal'

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

  const displayTasks = goal.deleteCompletedTasks ? [...tasks].filter((m) => m.status !== 'completed') : [...tasks]

  const handleAddTask = async (item: UserTask) => {
    let newTasks = [...tasks]
    const newGoal = { ...goal }
    newTasks.push(item)
    if (newGoal.deleteCompletedTasks) {
      newTasks = newTasks.filter((m) => m.status !== 'completed')
    }
    newTasks = reorderTasks(newTasks)
    await putUserGoalTasks(username, newGoal.id!, newTasks)
    const resultGoal = await saveGoal(newGoal, newTasks)
    onMutated(resultGoal, newTasks)
  }
  const handleDeleteTask = async (item: UserTask) => {
    let newTasks = [...tasks].filter((m) => m.id !== item.id)
    if (goal.deleteCompletedTasks) {
      newTasks = newTasks.filter((m) => m.status !== 'completed')
    }
    await putUserGoalTasks(username, goal.id!, newTasks)
    const resultGoal = await saveGoal(goal, newTasks)
    onMutated(resultGoal, newTasks)
  }
  const handleModifyTask = async (item: UserTask) => {
    // console.log(item)
    let newTasks = [...tasks]
    replaceItemInArray(item, newTasks, 'id', item.id!)
    if (goal.deleteCompletedTasks) {
      newTasks = newTasks.filter((m) => m.status !== 'completed')
    }
    newTasks = reorderTasks(newTasks)

    await putUserGoalTasks(username, item.goalId!, newTasks)
    const resultGoal = await saveGoal(goal, newTasks)

    onMutated(resultGoal, newTasks)
  }

  const saveGoal = async (goal: UserGoal, newTasks: UserTask[]) => {
    const goalCopy = { ...goal }
    let tasksCopy = [...newTasks]
    if (goalCopy.deleteCompletedTasks) {
      tasksCopy = tasksCopy.filter((m) => m.status !== 'completed')
    }
    goalCopy.dateModified = dayjs().format()
    goalCopy.stats = getGoalStats(tasksCopy)
    goalCopy.dateModified = dayjs().format()
    if (tasksCopy.length > 0) {
      const completed = filter(tasksCopy, (e) => e.status === 'completed')
      goalCopy.completePercent = calculatePercentInt(completed.length, tasksCopy.length)
    } else {
      goalCopy.completePercent = 0
    }
    let existingGoals = await getUserGoals(constructUserGoalsKey(username))
    replaceItemInArray(goalCopy, existingGoals, 'id', goalCopy.id!)
    existingGoals = orderBy(existingGoals, ['dateModified'], ['desc'])
    await putUserGoals(constructUserGoalsKey(username), existingGoals)
    return goalCopy
  }

  const handleDeleteGoal = async () => {
    setShowDeleteGoalConfirm(false)
    let goals = await getUserGoals(constructUserGoalsKey(username))
    const newGoals = goals.filter((m) => m.id !== goal.id)
    await putUserGoals(constructUserGoalsKey(username), newGoals)
    await putUserGoalTasks(username, goal.id!, [], getSecondsFromEpoch())
    onDeleted(goal)
    router.push('/protected/csr/goals')
  }

  const handleModifyGoal = async (editGoal: UserGoal) => {
    let newTasks = [...tasks]
    const resultGoal = await saveGoal(editGoal, newTasks)
    setGoalEditMode(false)
    if (resultGoal.deleteCompletedTasks) {
      newTasks = newTasks.filter((m) => m.status !== 'completed')
      await putUserGoalTasks(username, editGoal.id!, newTasks)
    }
    onMutated(resultGoal, newTasks)
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
      {goalEditMode ? (
        <EditGoal goal={goal} onSaveGoal={handleModifyGoal} onShowCompletedTasks={() => {}} onCancelEdit={() => setGoalEditMode(false)} />
      ) : (
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
            tasks={displayTasks}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onModifyTask={handleModifyTask}
          />
          <ConfirmDeleteDialog
            show={showDeleteGoalConfirm}
            text={`Are you sure you want to delete '${goal.body}' and all of its tasks?`}
            onConfirm={handleDeleteGoal}
            onCancel={() => setShowDeleteGoalConfirm(false)}
          />
        </>
      )}
    </>
  )
}

export default SingleGoalDisplay
