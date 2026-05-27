'use client'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import StocksPageLayout from 'components/Organizms/stocks/StocksPageLayout'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const StockPageLayoutWrapper = () => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  return (
    <>
      {isValidatingProfile && <ComponentLoader />}
      {!isValidatingProfile && <StocksPageLayout userProfile={userProfile} />}
    </>
  )
}

export default StockPageLayoutWrapper
