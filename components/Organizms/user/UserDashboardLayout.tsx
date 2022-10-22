import { Box, Button, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import router from 'next/router'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import LargeSpinner from 'components/Atoms/Loaders/LargeSpinner'
import { getUserProfile, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { Divider } from '@aws-amplify/ui-react'
import WarmupBox from 'components/Atoms/WarmupBox'
import { ApiError } from 'next/dist/server/api-utils'

const UserDashboardLayout = ({ username }: { username: string | undefined }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null)
  const [currTime, setCurrTime] = React.useState('')
  dayjs.extend(utc)

  const loadData = async (userId: string | undefined) => {
    if (userId) {
      const key = constructUserProfileKey(userId)
      const userProfile: UserProfile = {
        id: key,
        noteTitles: [],
      }
      let profile = await getUserProfile(userId)
      if (profile instanceof ApiError) {
        setIsLoading(false)
        setUserProfile(null)
        return
      }

      if (profile !== null) {
        userProfile.noteTitles = profile.noteTitles
      }

      setIsLoading(false)
      setUserProfile(userProfile)
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
    <Box sx={{ my: 2 }}>
      {isLoading && <WarmupBox />}
      {userProfile && (
        <>
          <CenterStack sx={{ py: 1 }}>
            <Typography variant='subtitle1'>Take notes</Typography>
          </CenterStack>
          <CenterStack sx={{ py: 2 }}>
            {/* <InternalLinkButton text={`Notes: ${userProfile.noteCount}`} route='/' /> */}
            <Button
              color='secondary'
              variant='contained'
              onClick={() => {
                router.push('/protected/csr/notes')
              }}
            >{`Notes: ${userProfile.noteTitles.length}`}</Button>
          </CenterStack>
        </>
      )}
      {/*  <CenterStack sx={{ pt: 4 }}>
        <Typography variant='body2'>{currTime}</Typography>
      </CenterStack> */}
      <Divider />
    </Box>
  )
}

export default UserDashboardLayout
