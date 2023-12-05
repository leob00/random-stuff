import { Container, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import useSWR, { mutate } from 'swr'
import { useUserController } from 'hooks/userController'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { getUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const Profile = () => {
  const { authProfile } = useUserController()
  const key = constructUserProfileKey(authProfile?.username ?? 'user-profile')
  const fetcherFn = async (url: string, key: string) => {
    const response = (await getUserProfile(authProfile?.username ?? 'user-profile')) as UserProfile | null
    return response
  }

  const { data, isLoading, isValidating } = useSWR(key, ([url, key]) => fetcherFn(url, key))

  return (
    <Container>
      {isLoading && <BackdropLoader />}
      {isValidating && <BackdropLoader />}
      <CenterStack>yo!</CenterStack>
      {data && <Typography variant='h6'>hello, {data.username}</Typography>}
    </Container>
  )
}

export default withAuthenticator(Profile)
