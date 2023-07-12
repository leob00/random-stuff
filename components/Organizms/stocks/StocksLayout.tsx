import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import useSWR from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import StocksDisplay from './StocksDisplay'

const StocksLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const enc = encodeURIComponent(weakEncrypt(`user-stock_list[${userProfile.username}]`))
  const fetchData = async (url: string, enc: string) => {
    const result = (await get(url, { enc: enc })) as StockQuote[]
    return result
  }

  const { data: stocks, isLoading, isValidating } = useSWR(['/api/edgeGetRandomStuff', enc], ([url, enc]) => fetchData(url, enc))
  return (
    <>
      {isValidating && <BackdropLoader />}
      {isLoading && <BackdropLoader />} {stocks && <StocksDisplay userProfile={userProfile} result={stocks} />}
    </>
  )
}

export default StocksLayout
