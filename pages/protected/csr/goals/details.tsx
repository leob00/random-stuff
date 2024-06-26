import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import Seo from 'components/Organizms/Seo'
import SingleGoalDisplay from 'components/Organizms/user/goals/SingleGoalDisplay'
import { constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getUserGoals, getUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { useRouter } from 'next/router'
import React from 'react'
import useSWR, { mutate } from 'swr'

const Page = () => {
  const router = useRouter()
  const id = router.query['id'] as string
  const token = router.query['token'] as string
  const goalId = weakDecrypt(decodeURIComponent(id))
  const username = weakDecrypt(decodeURIComponent(token))
  const tasksMutateKey = ['/api/edgeGetRandomStuff', id]
  const goalMutateKey = ['/api/edgeGetRandomStuff', token]

  const fetchGoalTasks = async (url: string, enc: string) => {
    const result = await getUserGoalTasks(goalId)
    return result
  }
  const fetchGoal = async (url: string, enc: string) => {
    const results = await getUserGoals(constructUserGoalsKey(username))
    const result = results.find((m) => m.id === goalId)
    return result
  }
  const { data: goal, isLoading } = useSWR(goalMutateKey, ([url, enc]) => fetchGoal(url, enc))
  const { data: tasks, isValidating } = useSWR(tasksMutateKey, ([url, enc]) => fetchGoalTasks(url, enc))

  const handleMutated = async (newGoal: UserGoal, newTasks: UserTask[]) => {
    mutate(goalMutateKey, newGoal, { revalidate: false })
    mutate(tasksMutateKey, newTasks, { revalidate: false })
  }
  const handleDeleted = async (deletedGoal: UserGoal) => {
    mutate(tasksMutateKey, [], { revalidate: false })
  }

  return (
    <>
      <Seo pageTitle='Goals' />
      <ResponsiveContainer>
        {isValidating && <BackdropLoader />}
        {isLoading && (
          <>
            <BackdropLoader />
          </>
        )}
        {goal && <PageHeader text={`Goal: ${goal.body}`} backButtonRoute={'/protected/csr/goals'} />}
        {goal && tasks && (
          <>
            <SingleGoalDisplay username={username} goal={goal} tasks={tasks} onMutated={handleMutated} onDeleted={handleDeleted} />
          </>
        )}
        <>
          {!isLoading && !isValidating && !goal && (
            <Box>
              <NoDataFound />
              <CenterStack>
                <Box display={'flex'}>
                  <BackButton route='/protected/csr/goals' />
                </Box>
              </CenterStack>
            </Box>
          )}
        </>
      </ResponsiveContainer>
    </>
  )
}

export default Page
