import { Container } from '@mui/material'
import React from 'react'
import '@aws-amplify/ui-react/styles.css'
import { Authenticator } from '@aws-amplify/ui-react'
const login = () => {
  return (
    <Container>
      <Authenticator />
    </Container>
  )
}

export default login
