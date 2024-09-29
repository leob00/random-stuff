import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import StocksDisplay from './StocksDisplay'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { LocalStore } from 'lib/backend/store/useLocalStore'
import { getLatestQuotes } from 'lib/backend/api/qln/qlnApi'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { mutate } from 'swr'
import { getRecord } from 'lib/backend/csr/nextApiWrapper'

const StocksLayout = ({ userProfile, localStore }: { userProfile: UserProfile | null; localStore: LocalStore }) => {
  const mutateKey = `user-stock_list[${userProfile?.username ?? 'public'}]`

  const fetchData = async () => {
    if (userProfile) {
      const resp = await getRecord<StockQuote[]>(mutateKey)
      return resp
    } else {
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
  }

  const { data: stocks, isLoading } = useSwrHelper(mutateKey, fetchData, { revalidateOnFocus: false })
  const handleMutated = (newData: StockQuote[]) => {
    mutate(mutateKey, newData, { revalidate: false })
  }

  return (
    <>
      {/* {isLoading && <BackdropLoader />} */}
      {stocks && <StocksDisplay userProfile={userProfile} result={stocks} onMutated={handleMutated} localStore={localStore} />}
    </>
  )
}

export default StocksLayout
