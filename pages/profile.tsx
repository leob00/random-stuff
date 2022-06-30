import { Container, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'

const Profile = () => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    let fn = async () => {
      try {
        let user = await Auth.currentAuthenticatedUser()
        setUser(user)
      } catch (error) {
        setUser(null)
      }
    }
    fn()
  }, [])

  return <Container>{user && <Typography variant='h6'>hello, {user.attributes.email}</Typography>}</Container>
}

export default withAuthenticator(Profile)
