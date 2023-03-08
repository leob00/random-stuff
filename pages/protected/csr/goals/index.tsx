import { Container } from '@mui/system'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import UserGoalsLayout from 'components/Organizms/user/goals/UserGoalsLayout'
import { AmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import router from 'next/router'
import React from 'react'

const Page = () => {
  const [isLoggedIn, setIsLoggenIn] = React.useState(true)
  const [user, setUser] = React.useState<AmplifyUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

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
    <ResponsiveContainer>
      {isLoggedIn ? (
        <>
          <BackButton
            onClicked={() => {
              router.push('/protected/csr/dashboard')
            }}
          />
          {isLoading ? <WarmupBox text='loading' /> : <>{user && <UserGoalsLayout username={user.email} />}</>}
        </>
      ) : (
        <PleaseLogin />
      )}
    </ResponsiveContainer>
  )
}

export default Page
