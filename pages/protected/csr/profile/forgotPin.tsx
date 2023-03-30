import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import SendPinLayout from 'components/Organizms/user/profile/SendPinLayout'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { AmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import React from 'react'

const ForgotPin = () => {
  const [ticket, setTicket] = React.useState<AmplifyUser | null>(null)
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const userController = useUserController()
  React.useEffect(() => {
    const fn = async () => {
      let userTicket: AmplifyUser | null
      let profile: UserProfile | null = null
      userTicket = await getUserCSR()
      if (userTicket) {
        const key = constructUserProfileKey(userTicket.email)
        profile = await userController.refetchProfile(10)
        setProfile(profile)
      }
      setTicket(userTicket)
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ResponsiveContainer>
      {ticket && profile ? (
        <SendPinLayout ticket={ticket} profile={profile} />
      ) : (
        <Box>{isLoading ? <WarmupBox text='loading profile...' /> : <PleaseLogin />}</Box>
      )}
    </ResponsiveContainer>
  )
}

export default ForgotPin
