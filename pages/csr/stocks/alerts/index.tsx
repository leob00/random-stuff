import { Box } from '@mui/material'
import Seo from 'components/Organizms/Seo'
import StockAlertsLayout from 'components/Organizms/stocks/alerts/StockAlertsLayout'
import RequireClaim from 'components/Organizms/user/RequireClaim'
import { useUserController } from 'hooks/userController'
import React from 'react'

const Page = () => {
  const { authProfile, fetchProfilePassive, setProfile } = useUserController()

  React.useEffect(() => {
    if (!authProfile) {
      const fn = async () => {
        const p = await fetchProfilePassive()
        if (p) {
          setProfile(p)
        }
      }
      fn()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile])

  return (
    <Box>
      <Seo pageTitle='Stock Alerts' />
      <RequireClaim claimType='rs'>
        <>{authProfile && <StockAlertsLayout userProfile={authProfile} />}</>
      </RequireClaim>
    </Box>
  )
}

export default Page
