import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'
import { signOut as amplifySignOut } from 'aws-amplify/auth'

const PleaseLogin = ({ message = 'Sorry! Looks like you are not signed in.' }: { message?: string }) => {
  const signOut = async () => {
    try {
      await amplifySignOut({ global: false })
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <Box sx={{ border: `solid 1px ${CasinoBlueTransparent}`, borderRadius: 2 }} mt={4}>
      <Box sx={{ my: 2 }}>
        <CenteredHeader title={''} description={message}></CenteredHeader>
        <Box sx={{ my: 2, textAlign: 'center' }} pb={2}>
          <PrimaryButton
            text='Sign In'
            onClicked={() => {
              signOut()
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default PleaseLogin
