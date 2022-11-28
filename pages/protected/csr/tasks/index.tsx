import { Box } from '@mui/material'
import BackButton from 'components/Atoms/Buttons/BackButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredParagraph from 'components/Atoms/Text/CenteredParagraph'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { AmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import router from 'next/router'
import React from 'react'

const Page = () => {
  const [isLoggedIn, setIsLoggenIn] = React.useState(true)
  React.useEffect(() => {
    const fn = async () => {
      setIsLoggenIn((await getUserCSR()) !== null)
    }
    fn()
  }, [])

  return isLoggedIn ? (
    <Box>
      <BackButton
        onClicked={() => {
          router.push('/protected/csr/dashboard')
        }}
      />
      <CenteredTitle title='Tasks' />
      <HorizontalDivider />
      <Box>
        <CenteredParagraph text={'coming soon'} />
      </Box>
    </Box>
  ) : (
    <PleaseLogin />
  )
}

export default Page
