import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import React, { useState } from 'react'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import { useRouter } from 'next/navigation'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'

const PleaseLogin = ({ message = 'please sign in or sign up to use this feature.' }: { message?: string }) => {
  const router = useRouter()
  const [showSignIn, setShowSignIn] = useState(true)

  const handleSignInClick = async () => {
    router.push('/login')
  }
  const handleSignUpClick = async () => {
    router.push('/register')
  }
  return (
    <Box sx={{ border: `solid 1px ${CasinoBlueTransparent}`, borderRadius: 2 }} py={4}>
      {showSignIn && (
        <Box sx={{ my: 2 }}>
          <CenteredHeader title={'Sign in required'} description={message}></CenteredHeader>

          <Box my={2} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2} py={4}>
            <SuccessButton text='Sign In' onClicked={handleSignInClick} />
            <PrimaryButton text='Sign Up' onClicked={handleSignUpClick} />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default PleaseLogin
