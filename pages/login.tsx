import { Container, Link } from '@mui/material'
import React from 'react'
import { Auth } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import { withAuthenticator, Button as LoginButton, Heading, Authenticator } from '@aws-amplify/ui-react'
import router from 'next/router'
const login = () => {
  return (
    <Container>
      <Authenticator />
    </Container>
  )
}

export default login
