import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { get } from 'lib/backend/api/fetchFunctions'
import StocksDisplay from './StocksDisplay'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { LocalStore } from 'lib/backend/store/useLocalStore'
import { getLatestQuotes } from 'lib/backend/api/qln/qlnApi'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { mutate } from 'swr'

const StocksLayout = ({ userProfile, localStore }: { userProfile: UserProfile | null; localStore: LocalStore }) => {
  const enc = encodeURIComponent(weakEncrypt(`user-stock_list[${userProfile?.username ?? 'public'}]`))
  //const mutateKey = ['/api/edgeGetRandomStuff', enc]
  const mutateKey = `my-stocks${enc}`

  const fetchData = async () => {
    const url = '/api/edgeGetRandomStuff'
    if (userProfile) {
      const resp = await get(url, { enc: enc })
      const result = resp as StockQuote[]
      return result
    }
    const res = localStore.myStocks.data
    const stockMap = getMapFromArray(res, 'Symbol')
    const latest = await getLatestQuotes(res.map((m) => m.Symbol))
    latest.forEach((item) => {
      const existing = stockMap.get(item.Symbol)!
      item.GroupName = existing.GroupName
    })
    localStore.saveStocks(latest)
    return latest
  }

  const { data: stocks, isLoading } = useSwrHelper(mutateKey, fetchData, { revalidateOnFocus: false })
  const handleMutated = (newData: StockQuote[]) => {
    mutate(mutateKey, newData, { revalidate: false })
  }

  return (
    <>
      {isLoading && <BackdropLoader />}
      {stocks && <StocksDisplay userProfile={userProfile} result={stocks} onMutated={handleMutated} localStore={localStore} />}
    </>
  )
}

export default StocksLayout
