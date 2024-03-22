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
        <CenterStack sx={{ py: 4 }}>
          <Typography variant='body2'>please login</Typography>
        </CenterStack>
        <LoginLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page
