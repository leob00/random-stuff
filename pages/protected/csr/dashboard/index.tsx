import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import UserDashboardLayout from 'components/Organizms/user/UserDashboardLayout'
import { useUserController } from 'hooks/userController'
import React from 'react'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { getUserCSR } from 'lib/backend/auth/userUtil'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fn = async () => {
      //const ticket = await getUserCSR()
      //console.log(ticket)
      if (!userController.authProfile) {
        const p = await userController.fetchProfilePassive(300)
        if (!p) {
          console.log('unable to load profile')
        }
        userController.setProfile(p)
      }
      setLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController.ticket])

  return (
    <ResponsiveContainer>
      <PageHeader text={'Dashboard'} backButtonRoute={'/'} />
      <Box>{loading ? <WarmupBox /> : userController.authProfile ? <UserDashboardLayout ticket={userController.ticket} /> : <PleaseLogin />}</Box>
    </ResponsiveContainer>
  )
}

export default Page
