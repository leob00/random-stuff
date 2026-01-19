'use client'
import StockAlertsLayout from 'components/Organizms/stocks/alerts/StockAlertsLayout'
import RequireClaim from 'components/Organizms/user/RequireClaim'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const StockAlertsDisplay = () => {
  const { userProfile, isValidating } = useProfileValidator()
  return (
    <RequireClaim claimType='rs'>
      <>{userProfile && !isValidating && <StockAlertsLayout userProfile={userProfile} />}</>
    </RequireClaim>
  )
}

export default StockAlertsDisplay
