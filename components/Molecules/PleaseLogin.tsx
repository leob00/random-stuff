'use client'
import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import { usePathname, useRouter } from 'next/navigation'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import WarningMessage from 'components/Atoms/Text/WarningMessage'

const PleaseLogin = ({ message = 'please sign in or sign up to use this feature.' }: { message?: string }) => {
  const router = useRouter()
  const path = usePathname() ?? ''

  const handleSignInClick = async () => {
    router.push(`/login?ret=${encodeURIComponent(path)}`)
  }
  const handleSignUpClick = async () => {
    router.push('/register')
  }
  return (
    <Box sx={{ border: `solid 1px ${CasinoBlueTransparent}`, borderRadius: 2 }} py={4}>
      <Box sx={{ my: 2 }}>
        <WarningMessage text='oops... you are not signed in...' />

        <CenteredHeader title={''} description={message}></CenteredHeader>
        <Box my={2} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2} py={4}>
          <SuccessButton text='Sign In' onClicked={handleSignInClick} />
          <PrimaryButton text='Sign Up' onClicked={handleSignUpClick} />
        </Box>
      </Box>
    </Box>
  )
}

export default PleaseLogin
