import { constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getRecord, searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { filter, orderBy } from 'lodash'
import React from 'react'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import UserGoalsDisplay from './UserGoalsDisplay'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { useSwrHelper } from 'hooks/useSwrHelper'

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

const UserGoalsLayout = ({ username }: { username: string }) => {
  const goalsKey = constructUserGoalsKey(username)

  const fetchGoalsData = async () => {
    const goalsResp = getRecord<UserGoal[]>(goalsKey)
    const tasksResp = searchRecords(`user-goal-tasks[${username}]`)
    const [goalsData, tasksData] = await Promise.all([goalsResp, tasksResp])
    const tasks = tasksData.flatMap((m) => JSON.parse(m.data) as UserTask)
    const result = mapGoalTasks(goalsData, tasks)
    return result
  }
  const { data: goalsAndTasks, error, isLoading } = useSwrHelper(goalsKey, fetchGoalsData)

  return (
    <>
      {isLoading && <BackdropLoader />}
      {error && <ErrorMessage text='Opps. We encountered and error. Please try refreshing the page.' />}
      {goalsAndTasks && <UserGoalsDisplay goalsAndTasks={goalsAndTasks} username={username} />}
    </>
  )
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

export default UserGoalsLayout
