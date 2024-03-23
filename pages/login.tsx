import React from 'react'
import '@aws-amplify/ui-react/styles.css'
import LoginLayout from 'components/Organizms/Login/LoginLayout'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenterStack from 'components/Atoms/CenterStack'
import { Typography } from '@mui/material'

const Page = () => {
  return (
    <>
      <ResponsiveContainer>
        <LoginLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page
