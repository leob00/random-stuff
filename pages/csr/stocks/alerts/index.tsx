import { Box } from '@mui/material'
import BackButton from 'components/Atoms/Buttons/BackButton'
import StockAlertsLayout from 'components/Organizms/stocks/alerts/StockAlertsLayout'
import RequireClaim from 'components/Organizms/user/RequireClaim'
import { useUserController } from 'hooks/userController'
import React from 'react'

const Page = () => {
  const { authProfile } = useUserController()

  return (
    <Box>
      <BackButton />
      <RequireClaim claimType='rs'>
        <>{authProfile && <StockAlertsLayout userProfile={authProfile} />}</>
      </RequireClaim>
    </Box>
  )
}

export default Page
