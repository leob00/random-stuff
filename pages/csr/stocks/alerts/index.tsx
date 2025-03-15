import { Box } from '@mui/material'
import Seo from 'components/Organizms/Seo'
import StockAlertsLayout from 'components/Organizms/stocks/alerts/StockAlertsLayout'
import RequireClaim from 'components/Organizms/user/RequireClaim'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const Page = () => {
  const { userProfile, isValidating } = useProfileValidator()

  return (
    <Box>
      <Seo pageTitle='Stock Alerts' />
      <RequireClaim claimType='rs'>
        <>{userProfile && !isValidating && <StockAlertsLayout userProfile={userProfile} />}</>
      </RequireClaim>
    </Box>
  )
}

export default Page
