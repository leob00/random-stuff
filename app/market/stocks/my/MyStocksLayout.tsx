'use client'

import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import StocksLayout from 'components/Organizms/stocks/StocksLayout'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { useLocalStore } from 'lib/backend/store/useLocalStore'

const MyStocksLayout = () => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  const localStore = useLocalStore()
  return <>{isValidatingProfile ? <ComponentLoader mt={20} /> : <StocksLayout userProfile={userProfile} localStore={localStore} />}</>
}

export default MyStocksLayout
