import { constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getUserGoals, getUserTasks } from 'lib/backend/csr/nextApiWrapper'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { filter, orderBy } from 'lodash'
import React from 'react'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import useSWR, { mutate } from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import UserGoalsDisplay from './UserGoalsDisplay'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'

export interface UserGoalAndTask {
  goal: UserGoal
  tasks: UserTask[]
}

export interface UserGoalsModel {
  goals: UserGoal[]
  username: string
  barChart?: BarChart
  goalsAndTasks: UserGoalAndTask[]
  showAddGoalForm: boolean
}

export function reorderTasks(list: UserTask[]) {
  const inProg = orderBy(
    filter(list, (e) => e.status !== 'completed'),
    ['dueDate', 'status'],
    ['asc', 'desc'],
  )
  const completed = orderBy(
    filter(list, (e) => e.status === 'completed'),
    ['dateCompleted'],
    ['desc'],
  )
  const merged = [...inProg, ...completed]
  return merged
}
const mapGoalTasks = (goals: UserGoal[], tasks: UserTask[]) => {
  const goalsAndTasks: UserGoalAndTask[] = []
  const goalsCopy = [...goals]
  goalsCopy.forEach((goal) => {
    const goalTasks = [...tasks].filter((e) => e.goalId === goal.id)
    goal.stats = getGoalStats(goalTasks)

    if (!goal.completePercent) {
      goal.completePercent = 0
    }
    goalsAndTasks.push({
      goal: goal,
      tasks: goalTasks,
    })
  })
  return goalsAndTasks
}

const UserGoalsLayout = ({ username }: { username: string }) => {
  const goalsKey = constructUserGoalsKey(username)
  const goalsMutateKey = ['/api/edgeGetRandomStuff', encodeURIComponent(weakEncrypt(goalsKey))]

  const fetchGoalsData = async (url: string, enc: string) => {
    const goals = await getUserGoals(constructUserGoalsKey(username))
    const tasks = await getUserTasks(username)
    const result = mapGoalTasks(goals, tasks)
    return result
  }
  const { data: goalsAndTasks, error, isLoading, isValidating } = useSWR(goalsMutateKey, ([url, enc]) => fetchGoalsData(url, enc))

  return (
    <>
      {isLoading && <BackdropLoader />}
      {isValidating && <BackdropLoader />}
      {error && <ErrorMessage text='Opps. We encountered and error. Please try refreshing the page.' />}
      {goalsAndTasks && <UserGoalsDisplay goalsAndTasks={goalsAndTasks} username={username} />}
    </>
  )
}

export default UserGoalsLayout
