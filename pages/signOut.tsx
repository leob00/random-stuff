import React from 'react'
import LoginLayout from 'components/Organizms/Login/LoginLayout'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenterStack from 'components/Atoms/CenterStack'
import { Typography } from '@mui/material'

const Page = () => {
  return (
    <>
      <ResponsiveContainer>
        <CenterStack sx={{ py: 2 }}>
          <Typography variant='h5'>You are currently signed out. </Typography>
        </CenterStack>
        <LoginLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page
