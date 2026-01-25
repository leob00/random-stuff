'use client'
import { constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getDynamoItemData, putUserGoals, searchDynamoItemsByCategory } from 'lib/backend/csr/nextApiWrapper'
import { filter, orderBy } from 'lodash'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import UserGoalsDisplay from './UserGoalsDisplay'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { useUserController } from 'hooks/userController'
import { mutate } from 'swr'
import { UserGoal, UserTask } from './goalModels'

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

const UserGoalsLayout = () => {
  const { authProfile } = useUserController()
  const username = authProfile!.username
  const goalsKey = constructUserGoalsKey(username)

  const fetchGoalsData = async () => {
    const goalsResp = (await getDynamoItemData<UserGoal[]>(goalsKey)) ?? []
    const tasksResp = await searchDynamoItemsByCategory(`user-goal-tasks[${username}]`)
    const [goalsData, tasksData] = await Promise.all([goalsResp, tasksResp])
    const tasks = tasksData.flatMap((m) => JSON.parse(m.data) as UserTask)
    const result = mapGoalTasks(goalsKey, goalsData, tasks)
    return result
  }
  const { data: goalsAndTasks, error, isLoading } = useSwrHelper(goalsKey, fetchGoalsData, { revalidateOnFocus: false })
  const handleRefresh = () => {
    mutate(goalsKey)
  }
  return (
    <>
      {error && <ErrorMessage text='Opps. We encountered and error. Please try refreshing the page.' />}
      {goalsAndTasks && <UserGoalsDisplay goalsAndTasks={goalsAndTasks} username={username} onRefresh={handleRefresh} />}
    </>
  )
}
const mapGoalTasks = (goalsKey: string, goals: UserGoal[], tasks: UserTask[]) => {
  const goalsAndTasks: UserGoalAndTask[] = []
  const goalsCopy = [...goals]
  // run this if you lose data remember to delete goals item and uncomment putUserGoals
  // tasks.forEach((task) => {
  //   const ex = goalsCopy.find((m) => m.goalId == task.goalId)
  //   if (!ex) {
  //     goalsCopy.push({
  //       id: task.goalId,
  //       goalId: task.goalId,
  //       body: task.goalId,
  //     })
  //   }
  // })

  goalsCopy.forEach((goal) => {
    const goalTasks = tasks.filter((e) => e.goalId === goal.id)
    goal.stats = getGoalStats(goalTasks)

    if (!goal.completePercent) {
      goal.completePercent = 0
    }
    goalsAndTasks.push({
      goal: goal,
      tasks: goalTasks,
    })
  })
  //putUserGoals(goalsKey, goalsCopy)
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
