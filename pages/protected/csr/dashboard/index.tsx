import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import UserDashboardLayout from 'components/Organizms/user/UserDashboardLayout'
import { useUserController } from 'hooks/userController'
import React from 'react'
import router from 'next/router'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import PageHeader from 'components/Atoms/Containers/PageHeader'

const Page = () => {
  const userController = useUserController()
  //const userProfile = userController.authProfile
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fn = async () => {
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
      <Box>{loading ? <WarmupBox /> : userController.authProfile ? <UserDashboardLayout /> : <PleaseLogin />}</Box>
    </ResponsiveContainer>
  )
}

export default Page
