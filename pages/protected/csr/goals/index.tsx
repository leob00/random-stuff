import { Box } from '@mui/material'
import { Container } from '@mui/system'
import BackButton from 'components/Atoms/Buttons/BackButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import Loader from 'components/Loader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import UserGoalsLayout from 'components/Organizms/user/goals/UserGoalsLayout'
import { constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { AmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserGoals } from 'lib/backend/csr/nextApiWrapper'
import { UserGoal } from 'lib/models/userTasks'
import router from 'next/router'

import React from 'react'

const Page = () => {
  const [isLoggedIn, setIsLoggenIn] = React.useState(true)
  const [user, setUser] = React.useState<AmplifyUser | null>(null)
  //const [goals, setGoals] = React.useState<UserGoal[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  //const [goalsDDL, setGoalsDDL] = React.useState<DropdownItem[]>([])

  React.useEffect(() => {
    const fn = async () => {
      const userResult = await getUserCSR()
      setIsLoggenIn(userResult !== null)
      setUser(userResult)
      setIsLoading(false)
    }
    fn()
  }, [])

  return (
    <Container>
      {isLoggedIn ? (
        <>
          <BackButton
            onClicked={() => {
              router.push('/protected/csr/dashboard')
            }}
          />
          <CenteredTitle title='Goals' />
          <HorizontalDivider />
          {isLoading ? <WarmupBox text='loading' /> : <>{user && <UserGoalsLayout username={user.email} />}</>}
        </>
      ) : (
        <PleaseLogin />
      )}
    </Container>
  )
}

export default Page
