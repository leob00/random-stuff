import { Container } from '@mui/material'
import React from 'react'
import '@aws-amplify/ui-react/styles.css'
import { Authenticator } from '@aws-amplify/ui-react'
import LoginLayout from 'components/Organizms/Login/LoginLayout'
import { ColorsExample } from 'components/Organizms/Login/ColorsExample'

const login = () => {
  return (
    <>
      <LoginLayout />
    </>
  )
}

export default login
