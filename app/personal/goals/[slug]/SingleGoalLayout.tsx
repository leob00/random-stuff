'use client'

import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import Seo from 'components/Organizms/Seo'
import SingleGoalDisplay from 'components/Organizms/user/goals/SingleGoalDisplay'
import { UserGoal, UserTask } from 'components/Organizms/user/goals/goalModels'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getUserGoals, getUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'

const SingleGoalLayout = ({ goalId }: { goalId: string }) => {
  const router = useRouter()
  const tasksMutateKey = `goal-tasks-${goalId}`
  const goalMutateKey = `goal-${goalId}`

  const { userProfile, isValidating: validatingProfile } = useProfileValidator()

  const fetchGoalTasks = async () => {
    const result = await getUserGoalTasks(goalId)
    return result
  }
  const fetchGoal = async () => {
    const results = await getUserGoals(constructUserGoalsKey(userProfile!.username))
    const result = results.find((m) => m.id === goalId)
    return result
  }
  const { data: goal, isLoading: loadingGoals } = useSwrHelper(goalMutateKey, fetchGoal, { revalidateOnFocus: false })
  const { data: tasks, isLoading: loadingTasks } = useSwrHelper(tasksMutateKey, fetchGoalTasks, { revalidateOnFocus: false })

  const handleMutated = async (newGoal: UserGoal, newTasks: UserTask[]) => {
    mutate(goalMutateKey, newGoal, { revalidate: false })
    mutate(tasksMutateKey, newTasks, { revalidate: false })
  }
  const isLoading = loadingTasks || loadingGoals

  return (
    <>
      <Seo pageTitle='Goals' />
      <ResponsiveContainer>
        {userProfile && (
          <>
            {goal && <PageHeader text={`Goal: ${goal.body}`} />}
            {goal && tasks && <SingleGoalDisplay username={userProfile!.username} goal={goal} tasks={tasks} onMutated={handleMutated} />}
          </>
        )}
        <>
          {!isLoading && !validatingProfile && !goal && (
            <Box>
              <NoDataFound />
            </Box>
          )}
        </>
      </ResponsiveContainer>
    </>
  )
}

export default SingleGoalLayout
