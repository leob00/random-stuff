import { Box, Button, CircularProgress, Container, Typography } from '@mui/material'
import InternalLinkButton from 'components/Atoms/Buttons/InternalLinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getRandomStuff, LambdaDynamoRequest, LambdaResponse, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { axiosGet } from 'lib/backend/api/aws/useAxios'
import { axiosPut } from 'lib/backend/api/qln/useAxios'
import React from 'react'
import router from 'next/router'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import LargeSpinner from 'components/Atoms/Loaders/LargeSpinner'

const UserDashboardLayout = ({ username }: { username: string | undefined }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null)
  const [currTime, setCurrTime] = React.useState('')
  dayjs.extend(utc)

  const loadData = async (userId: string | undefined) => {
    if (userId) {
      const key = constructUserProfileKey(userId)
      const user: UserProfile = {
        id: key,
        noteCount: 0,
      }
      let response = await axiosGet(`/api/randomStuff?id=${key}`)
      if (response === null) {
        console.log('adding user profile')
        let req: LambdaDynamoRequest = {
          id: user.id,
          category: 'userProfile',
          data: user,
        }
        await axiosPut(`/api/putRandomStuff`, req)
      } else {
        const userProfile = response as UserProfile
        user.noteCount = userProfile.noteCount
        const arr = userProfile.id.split('#')
      }
      setIsLoading(false)
      setUserProfile(user)
    }
  }

  React.useEffect(() => {
    const fn = async () => {
      const time = dayjs().utc().local().format('MM/DD/YYYY hh:mm a')
      setCurrTime(time)
      await loadData(username)
    }
    fn()
  }, [])
  return (
    <Box sx={{ my: 2 }}>
      {isLoading && <LargeSpinner />}
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
                router.push('/protected/notes')
              }}
            >{`Notes: ${userProfile.noteCount}`}</Button>
          </CenterStack>
        </>
      )}
      <CenterStack sx={{ pt: 4 }}>
        <Typography variant='body2'>{currTime}</Typography>
      </CenterStack>
    </Box>
  )
}

export default UserDashboardLayout
