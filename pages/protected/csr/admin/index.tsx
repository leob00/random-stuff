import { Box, Typography } from '@mui/material'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import { useRouter } from 'next/router'
import React from 'react'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)
  const router = useRouter()

  React.useEffect(() => {
    const fn = async () => {
      const loggedInUser = await getUserCSR()
      if (!loggedInUser) {
        router.push('/login')
        return
      }

      const p = await userController.refetchProfile(300)
      if (p && loggedInUser.roles) {
        if (!userHasRole(loggedInUser.roles, 'Admin')) {
          router.push('/login')
          return
        }
      }
      setUserProfile(p)
      setLoading(false)
    }
    fn()
  }, [userController.username])

  return (
    <>
      <NonSSRWrapper>
        {loading ? (
          <WarmupBox />
        ) : userProfile ? (
          <>
            <BackToHomeButton />
            <CenteredTitle title='Admin' />

            <CenterStack>
              <Box maxHeight={300} sx={{ overflowY: 'auto' }}>
                <Typography variant='body1'>
                  <code>{JSON.stringify(userProfile.noteTitles)}</code>
                </Typography>
              </Box>
            </CenterStack>
          </>
        ) : (
          <PleaseLogin />
        )}
      </NonSSRWrapper>
    </>
  )
}

export default Page
