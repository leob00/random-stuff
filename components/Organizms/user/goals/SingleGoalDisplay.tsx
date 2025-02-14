import { Box } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import dayjs from 'dayjs'
import { constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getUserGoals, putUserGoals, putUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { replaceItemInArray } from 'lib/util/collections'
import { getSecondsFromEpoch } from 'lib/util/dateUtil'
import { calculatePercentInt } from 'lib/util/numberUtil'
import { filter, orderBy } from 'lodash'
import TaskList from './TaskList'
import { reorderTasks } from './UserGoalsLayout'
import { ListItemIcon, ListItemText } from '@mui/material'
import Delete from '@mui/icons-material/Delete'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import { useRouter } from 'next/router'
import EditGoal from './EditGoal'
import GoalStats from './GoalStats'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { UserGoal, UserTask } from './goalModels'
import { useState } from 'react'
import FadeIn from 'components/Atoms/Animations/FadeIn'

import ProgressDrawer from 'components/Atoms/Drawers/ProgressDrawer'
import { postBody, postDelete } from 'lib/backend/api/fetchFunctions'
import { sleep } from 'lib/util/timers'

const SingleGoalDisplay = ({
  username,
  goal,
  tasks,
  onMutated,
}: {
  username: string
  goal: UserGoal
  tasks: UserTask[]
  onMutated: (goal: UserGoal, tasks: UserTask[]) => void
}) => {
  const [goalEditMode, setGoalEditMode] = useState(false)
  const [showDeleteGoalConfirm, setShowDeleteGoalConfirm] = useState(false)
  const [snackbarText, setSnackbarText] = useState<string | null>(null)
  const router = useRouter()

  const displayTasks = goal.deleteCompletedTasks ? tasks.filter((m) => m.status !== 'completed') : [...tasks]

  const handleAddTask = async (item: UserTask) => {
    setSnackbarText('task added!')
    let newTasks = [...tasks]
    const newGoal = { ...goal }
    newTasks.unshift(item)
    if (newGoal.deleteCompletedTasks) {
      newTasks = newTasks.filter((m) => m.status !== 'completed')
    }
    putUserGoalTasks(username, newGoal.id!, newTasks)
    const resultGoal = await saveGoal(username, newGoal, newTasks)
    onMutated(resultGoal, newTasks)
    await sleep(250)
    setSnackbarText(null)

    //setIsSaving(false)
  }
  const handleDeleteTask = async (item: UserTask) => {
    let newTasks = [...tasks].filter((m) => m.id !== item.id)
    if (goal.deleteCompletedTasks) {
      newTasks = newTasks.filter((m) => m.status !== 'completed')
    }
    putUserGoalTasks(username, goal.id!, newTasks)
    if (item.files && item.files.length > 0) {
      for (let f of item.files) {
        await postBody('/api/aws/s3/item', 'DELETE', f)
        setSnackbarText(`deleted ${f.filename}`)
      }
    }
    const resultGoal = await saveGoal(username, goal, newTasks)

    onMutated(resultGoal, newTasks)
    await sleep(250)
    setSnackbarText(null)
  }
  const handleModifyTask = async (item: UserTask, closeEdit: boolean = false) => {
    if (item.status === 'completed') {
      setSnackbarText('task completed!')
    } else {
      setSnackbarText('task modified')
    }

    let newTasks = [...tasks]
    replaceItemInArray(item, newTasks, 'id', item.id!)
    if (goal.deleteCompletedTasks) {
      newTasks = newTasks.filter((m) => m.status !== 'completed')
    }
    newTasks = reorderTasks(newTasks)

    putUserGoalTasks(username, item.goalId!, newTasks)
    const resultGoal = await saveGoal(username, goal, newTasks)

    onMutated(resultGoal, newTasks)
    await sleep(250)
    setSnackbarText(null)
  }

  const handleDeleteGoal = async () => {
    setShowDeleteGoalConfirm(false)
    setSnackbarText(null)
    const files = tasks.filter((m) => !!m.files).flatMap((f) => f.files!)
    for (let f of files) {
      await postBody('/api/aws/s3/item', 'DELETE', f)
      setSnackbarText(`deleted ${f.filename}`)
    }
    const goals = await getUserGoals(constructUserGoalsKey(username))
    const newGoals = goals.filter((m) => m.id !== goal.id)
    await putUserGoals(constructUserGoalsKey(username), newGoals)
    await putUserGoalTasks(username, goal.id!, [], getSecondsFromEpoch())
    setSnackbarText(`deleted goal: ${goal.body}`)
    router.push('/protected/csr/goals')
  }

  const handleModifyGoal = async (editGoal: UserGoal) => {
    let newTasks = [...tasks]
    const resultGoal = await saveGoal(username, editGoal, newTasks)

    setGoalEditMode(false)
    if (resultGoal.deleteCompletedTasks) {
      newTasks = newTasks.filter((m) => m.status !== 'completed')
      putUserGoalTasks(username, editGoal.id!, newTasks)
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
        <FadeIn>
          <EditGoal goal={goal} onSaveGoal={handleModifyGoal} onShowCompletedTasks={() => {}} onCancelEdit={() => setGoalEditMode(false)} />
        </FadeIn>
      ) : (
        <>
          <Box py={2} display='flex' justifyContent='space-between'>
            <Box>
              {goal.stats && !goal.deleteCompletedTasks && (
                <>
                  <GoalStats goal={goal} completePercent={goal.completePercent ?? 0} />
                </>
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
      {snackbarText && <ProgressDrawer message={snackbarText} isOpen={!!snackbarText} />}
    </>
  )
}

const saveGoal = async (username: string, goal: UserGoal, newTasks: UserTask[]) => {
  const goalCopy = { ...goal }
  let tasksCopy = [...newTasks]
  if (goalCopy.deleteCompletedTasks) {
    tasksCopy = tasksCopy.filter((m) => m.status !== 'completed')
  }
  goalCopy.dateModified = dayjs().format()

  if (tasksCopy.length > 0) {
    const completed = filter(tasksCopy, (e) => e.status === 'completed')
    goalCopy.completePercent = calculatePercentInt(completed.length, tasksCopy.length)
  } else {
    goalCopy.completePercent = 0
  }
  goalCopy.stats = getGoalStats(tasksCopy)
  let existingGoals = await getUserGoals(constructUserGoalsKey(username))
  replaceItemInArray(goalCopy, existingGoals, 'id', goalCopy.id!)
  existingGoals = orderBy(existingGoals, ['dateModified'], ['desc'])
  putUserGoals(constructUserGoalsKey(username), existingGoals)
  return goalCopy
}

export default SingleGoalDisplay
