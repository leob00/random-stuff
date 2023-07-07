import { Typography, Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { CasinoBlackTransparent, CasinoBlueTransparent } from 'components/themes/mainTheme'
import router from 'next/router'
import React from 'react'

const PleaseLogin = ({ message = 'Sorry! Looks like you are not signed in.' }: { message?: string }) => {
  return (
    <Box sx={{ border: `solid 1px ${CasinoBlueTransparent}`, borderRadius: 2 }} mt={4}>
      <Box sx={{ my: 2 }}>
        <CenteredHeader title={''} description={message}></CenteredHeader>
        <Box sx={{ my: 2, textAlign: 'center' }} pb={2}>
          <PrimaryButton
            text='Sign In'
            onClicked={() => {
              router.push('/login')
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default PleaseLogin
