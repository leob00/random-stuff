import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { Sort, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import useSWR, { mutate } from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'
import StocksDisplay from './StocksDisplay'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const StocksLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const enc = encodeURIComponent(weakEncrypt(`user-stock_list[${userProfile.username}]`))
  const mutateKey = ['/api/edgeGetRandomStuff', enc]

  const fetchData = async (url: string, enc: string) => {
    const record = ''
    const resp = await get(url, { enc: enc })
    const result = resp as StockQuote[]
    return result
  }

  const { data: stocks, isLoading, isValidating } = useSWR(mutateKey, ([url, enc]) => fetchData(url, enc))

  const handleMutated = (newData: StockQuote[]) => {
    mutate(mutateKey, newData, { revalidate: false })
  }
  const handleCustomSortUpdate = (data?: Sort[]) => {}

  return (
    <>
      {isLoading && <BackdropLoader />}
      {isValidating && <BackdropLoader />}
      {stocks && <StocksDisplay userProfile={userProfile} result={stocks} onMutated={handleMutated} onCustomSortUpdated={handleCustomSortUpdate} />}
    </>
  )
}

export default StocksLayout
