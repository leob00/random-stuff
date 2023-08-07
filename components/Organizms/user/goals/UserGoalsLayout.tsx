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
    filter(list, (e) => e.status === 'in progress'),
    ['status', 'dueDate'],
    ['desc', 'asc'],
  )
  const completed = orderBy(
    filter(list, (e) => e.status === 'completed'),
    ['dateCompleted'],
    ['desc'],
  )
  const result: UserTask[] = []
  result.push(...inProg)
  result.push(...completed)
  return result
}

const UserGoalsLayout = ({ username }: { username: string }) => {
  const goalsKey = constructUserGoalsKey(username)
  const tasksKey = `user-goal-tasks[${username}]`
  const goalsEnc = encodeURIComponent(weakEncrypt(goalsKey))
  const tasksEnc = encodeURIComponent(weakEncrypt(tasksKey))
  const goalsMutateKey = ['/api/edgeGetRandomStuff', goalsEnc]
  const taskMutateKey = ['/api/edgeGetRandomStuff', tasksEnc]

  const fetchGoalsData = async (url: string, enc: string) => {
    const result = await getUserGoals(constructUserGoalsKey(username))

    return result
  }
  const fetchTasksData = async (url: string, enc: string) => {
    const result = await getUserTasks(username)
    //console.log('tasks: ', result)
    return result
  }

  const { data: goals } = useSWR(goalsMutateKey, ([url, enc]) => fetchGoalsData(url, enc))
  const { data: tasks, isLoading, isValidating } = useSWR(taskMutateKey, ([url, enc]) => fetchTasksData(url, enc))
  const handleMutated = (newGoals: UserGoal[]) => {
    mutate(goalsMutateKey, newGoals, { revalidate: false })
  }
  return (
    <>
      {isLoading && (
        <>
          <BackdropLoader />
          <LargeGridSkeleton />
        </>
      )}
      {isValidating && (
        <>
          <BackdropLoader />
        </>
      )}
      {goals && tasks && <UserGoalsDisplay goals={goals} tasks={tasks} username={username} onMutated={handleMutated} />}
    </>
  )
}

export default UserGoalsLayout
