import { Box, Skeleton, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import router from 'next/router'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { Divider } from '@aws-amplify/ui-react'
import WarmupBox from 'components/Atoms/WarmupBox'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import BackButton from 'components/Atoms/Buttons/BackButton'
import ButtonSkeleton from 'components/Atoms/Skeletons/CenteredButtonSeleton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { useUserController } from 'hooks/userController'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'

const UserDashboardLayout = ({ username }: { username: string | undefined }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [currTime, setCurrTime] = React.useState('')

  const userController = useUserController()

  const loadData = async (userId: string | undefined) => {
    if (userId) {
      const key = constructUserProfileKey(userId)
      const userProfile: UserProfile = {
        id: key,
        username: userId,
        noteTitles: [],
      }

      let profile = await userController.getProfile()
      if (profile === null) {
        setIsLoading(false)
        return
      }
      userProfile.noteTitles = profile.noteTitles
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    const fn = async () => {
      const time = dayjs().utc().local().format('MM/DD/YYYY hh:mm a')
      setCurrTime(time)
      await loadData(username)
    }

    if (username) {
      fn()
    }
  }, [username])

  return (
    <>
      <Box sx={{ py: 2 }}>
        <CenterStack>
          <CenteredTitle title={'My Dashboard'} />
        </CenterStack>
        <BackButton
          onClicked={() => {
            router.push('/')
          }}
        />
      </Box>
      <Box sx={{ my: 2 }}>
        {isLoading && (
          <>
            <CenterStack>
              <Skeleton variant='text' sx={{ bgcolor: VeryLightBlueTransparent }}>
                <Typography variant='subtitle1'>Take Notes</Typography>
              </Skeleton>
            </CenterStack>
            <CenterStack>
              <ButtonSkeleton buttonText='Notes: 00' />
            </CenterStack>
          </>
        )}
        {userController.username && userController.authProfile && (
          <>
            <CenterStack>
              <Typography variant='subtitle1'>Take Notes</Typography>
            </CenterStack>
            <CenterStack sx={{ py: 2 }}>
              <SecondaryButton
                onClick={() => {
                  router.push('/protected/csr/notes')
                }}
                text={`Notes: ${userController.authProfile.noteTitles.length}`}
              ></SecondaryButton>
            </CenterStack>
          </>
        )}
        {/*  <CenterStack sx={{ pt: 8 }}>
          <Typography variant='body2'>{`${Math.floor(getUtcNow().valueOf() / 1000)}`}</Typography>
        </CenterStack> */}
      </Box>
      <Divider />
      {isLoading && <WarmupBox />}
    </>
  )
}

export default UserDashboardLayout
