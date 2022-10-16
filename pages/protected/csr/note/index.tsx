import { Box, Container, Typography } from '@mui/material'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import CenterStack from 'components/Atoms/CenterStack'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserProfile } from 'lib/backend/csr/nextApiWrapper'
import React from 'react'

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
      <BackToHomeButton />
      <Box sx={{ py: 2 }}>
        <CenterStack>
          <Typography variant='subtitle1'>comming soon</Typography>
        </CenterStack>
      </Box>
    </Container>
  )
}

export default Note
