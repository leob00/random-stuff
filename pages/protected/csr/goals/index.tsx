import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import UserGoalsLayout from 'components/Organizms/user/goals/UserGoalsLayout'
import { useUserController } from 'hooks/userController'
import { AmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import React from 'react'

const Page = () => {
  const auth = useUserController().ticket

  const [ticket, setTicket] = React.useState<AmplifyUser | null>(auth)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fn = async () => {
      if (!ticket) {
        const userResult = await getUserCSR()

        setTicket(userResult)
      }
      setIsLoading(false)

      //console.log(ticket)
    }
    fn()
  }, [ticket])

  return (
    <ResponsiveContainer>
      <PageHeader text={'Goals'} backButtonRoute={'/protected/csr/dashboard'} />
      {ticket ? <>{isLoading ? <WarmupBox text='loading' /> : <>{ticket && <UserGoalsLayout username={ticket.email} />}</>}</> : <PleaseLogin />}
    </ResponsiveContainer>
  )
}

export default Page
