import { Typography, Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import router from 'next/router'
import React from 'react'

const PleaseLogin = () => {
  return (
    <Typography variant='h6'>
      <Box sx={{ my: 4 }}>
        <CenteredHeader title={''} description={'Sorry! Looks like you are not signed in.'}></CenteredHeader>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <PrimaryButton
            text='Sign In'
            onClicked={() => {
              router.push('/login')
            }}
          />
        </Box>
      </Box>
    </Typography>
  )
}

export default PleaseLogin
