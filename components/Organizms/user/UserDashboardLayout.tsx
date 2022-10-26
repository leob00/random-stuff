import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import router from 'next/router'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { getUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { Divider } from '@aws-amplify/ui-react'
import WarmupBox from 'components/Atoms/WarmupBox'
import { ApiError } from 'next/dist/server/api-utils'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import BackButton from 'components/Atoms/Buttons/BackButton'
import ButtonSkeleton from 'components/Atoms/Skeletons/CenteredButtonSeleton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { useAuthStore } from 'lib/backend/auth/useAuthStore'
import shallow from 'zustand/shallow'

const UserDashboardLayout = ({ username }: { username: string | undefined }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [currTime, setCurrTime] = React.useState('')
  const { authProfile, setAuthProfile } = useAuthStore((state) => ({ authProfile: state.profile, setAuthProfile: state.setProfile }), shallow)
  dayjs.extend(utc)

  const loadData = async (userId: string | undefined) => {
    if (userId) {
      const key = constructUserProfileKey(userId)
      const userProfile: UserProfile = {
        id: key,
        noteTitles: [],
      }

      let profile = authProfile == null ? await getUserProfile(userId) : authProfile
      if (profile instanceof ApiError) {
        setIsLoading(false)
        setAuthProfile(null)
        return
      }

      if (profile !== null) {
        userProfile.noteTitles = profile.noteTitles
        setAuthProfile(userProfile)
      }
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
          <CenterStack>
            <ButtonSkeleton buttonText='Notes: 00' />
          </CenterStack>
        )}
        {authProfile && (
          <>
            <CenterStack sx={{ py: 2 }}>
              <SecondaryButton
                onClick={() => {
                  router.push('/protected/csr/notes')
                }}
                text={`Notes: ${authProfile.noteTitles.length}`}
              ></SecondaryButton>
            </CenterStack>
          </>
        )}
        {/*  <CenterStack sx={{ pt: 4 }}>

          <Typography variant='body2'>{`${numeral(getUtcNow().valueOf() / 1000).format()}`}</Typography>

        </CenterStack> */}
      </Box>
      <Divider />
      {isLoading && <WarmupBox />}
    </>
  )
}

export default UserDashboardLayout
