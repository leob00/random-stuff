import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import useSWR, { mutate, useSWRConfig } from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import StocksDisplay from './StocksDisplay'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import useSWRMutation from 'swr/mutation'
import { Typography } from '@mui/material'

const StocksLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const enc = encodeURIComponent(weakEncrypt(`user-stock_list[${userProfile.username}]`))
  const mutateKey = ['/api/edgeGetRandomStuff', enc]

  const fetchData = async (url: string, enc: string) => {
    const result = (await get(url, { enc: enc })) as StockQuote[]
    return result
  }

  const { data: stocks, isLoading, isValidating } = useSWR(mutateKey, ([url, enc]) => fetchData(url, enc))

  const handleMutated = (newData: StockQuote[]) => {
    mutate(mutateKey, newData, { revalidate: false })
  }

  return (
    <>
      {isValidating && <BackdropLoader />}
      {isLoading && (
        <>
          <LargeGridSkeleton />
        </>
      )}
      {stocks && <StocksDisplay userProfile={userProfile} result={stocks} onMutated={handleMutated} />}
    </>
  )
}

export default StocksLayout
