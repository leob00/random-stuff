import { constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getUserTasks } from 'lib/backend/csr/nextApiWrapper'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { filter, orderBy } from 'lodash'
import React from 'react'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import useSWR from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import UserGoalsDisplay from './UserGoalsDisplay'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'

export interface UserGoalAndTask {
  goal: UserGoal
  tasks: UserTask[]
}

export interface UserGoalsModel {
  isLoading: boolean
  isSaving: boolean
  selectedGoal?: UserGoal
  goals: UserGoal[]
  username: string
  goalEditMode: boolean
  showConfirmDeleteGoal: boolean
  showAddGoalForm: boolean
  barChart?: BarChart
  goalsAndTasks: UserGoalAndTask[]
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

  const fetchGoalsData = async (url: string, enc: string) => {
    const result = (await get(url, { enc: enc })) as UserGoal[]
    return result
  }
  const fetchTasksData = async (url: string, enc: string) => {
    const result = await getUserTasks(username)
    return result
  }

  const { data: goals } = useSWR(['/api/edgeGetRandomStuff', goalsEnc], ([url, enc]) => fetchGoalsData(url, enc))
  const { data: tasks, isLoading, isValidating } = useSWR(['/api/edgeGetRandomStuff', tasksEnc], ([url, enc]) => fetchTasksData(url, enc))

  return (
    <>
      {isLoading && (
        <>
          <BackdropLoader />
          <LargeGridSkeleton />
        </>
      )}
      {goals && tasks && <UserGoalsDisplay goals={goals} tasks={tasks} username={username} />}
    </>
  )
}

export default UserGoalsLayout
