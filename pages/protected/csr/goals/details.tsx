import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import Seo from 'components/Organizms/Seo'
import SingleGoalDisplay from 'components/Organizms/user/goals/SingleGoalDisplay'
import { UserGoal, UserTask } from 'components/Organizms/user/goals/goalModels'
import { constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getUserGoals, getUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'

const Page = () => {
  const router = useRouter()
  const id = router.query['id'] as string
  const token = router.query['token'] as string
  const goalId = weakDecrypt(decodeURIComponent(id))
  const username = weakDecrypt(decodeURIComponent(token))
  const tasksMutateKey = ['/api/edgeGetRandomStuff', id]
  const goalMutateKey = ['/api/edgeGetRandomStuff', token]

  const fetchGoalTasks = async (_: string, enc: string) => {
    const result = await getUserGoalTasks(goalId)
    return result
  }
  const fetchGoal = async (_: string, enc: string) => {
    const results = await getUserGoals(constructUserGoalsKey(username))
    const result = results.find((m) => m.id === goalId)
    return result
  }
  const { data: goal, isLoading: loadingGoals } = useSWR(goalMutateKey, ([url, enc]) => fetchGoal(url, enc), { revalidateOnFocus: false })
  const { data: tasks, isValidating: loadingTasks } = useSWR(tasksMutateKey, ([url, enc]) => fetchGoalTasks(url, enc), { revalidateOnFocus: false })

  const handleMutated = async (newGoal: UserGoal, newTasks: UserTask[]) => {
    mutate(goalMutateKey, newGoal, { revalidate: false })
    mutate(tasksMutateKey, newTasks, { revalidate: false })
  }
  const isLoading = loadingTasks || loadingGoals

  return (
    <>
      <Seo pageTitle='Goals' />
      <ResponsiveContainer>
        {isLoading && <BackdropLoader />}
        {goal && <PageHeader text={`Goal: ${goal.body}`} backButtonRoute={'/protected/csr/goals'} forceShowBackButton />}
        {goal && tasks && <SingleGoalDisplay username={username} goal={goal} tasks={tasks} onMutated={handleMutated} />}
        <>
          {!isLoading && !goal && (
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
