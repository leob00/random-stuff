import { Box, Container, Typography } from '@mui/material'
import BackButton from 'components/Atoms/Buttons/BackButton'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import CenterStack from 'components/Atoms/CenterStack'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserProfile } from 'lib/backend/csr/nextApiWrapper'
import React from 'react'
import router from 'next/router'

const Note = () => {
  const [profile, setProfile] = React.useState<UserProfile | null>(null)

  const loadData = async () => {
    let user = await getUserCSR()
    if (user) {
      let userProfile = await getUserProfile(user.email)
      setProfile(userProfile)
    }
  }
  React.useEffect(() => {
    const fn = async () => {
      await loadData()
    }
    fn()
  }, [])
  return (
    <Container>
      <BackButton
        onClicked={() => {
          router.push('/protected/csr/notes')
        }}
      />
      <Box sx={{ py: 2 }}>
        <CenterStack>
          <Typography variant='subtitle1'>coming soon</Typography>
        </CenterStack>
      </Box>
    </Container>
  )
}

export default Note
