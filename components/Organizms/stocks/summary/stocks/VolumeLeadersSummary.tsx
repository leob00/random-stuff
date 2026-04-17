'use client'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useEffect } from 'react'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { sleep } from 'lib/util/timers'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { usePolling } from 'hooks/usePolling'
import { mutate } from 'swr'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import StockListSummary from './StockListSummary'
import { getRandomInteger } from 'lib/util/numberUtil'
import { useRouter } from 'next/navigation'

const VolumeLeadersSummary = ({ userProfile, showCompanyName = false }: { userProfile: UserProfile | null; showCompanyName?: boolean }) => {
  const mutateKey = 'stock-market-summary-volume-leaders'
  const { pollCounter } = usePolling(1000 * 360) // 3 minutes
  const router = useRouter()

  const dataFn = async () => {
    await sleep(getRandomInteger(250, 2500))
    const report = await serverGetFetch(`/StockReports?id=${'volumeleaders'}&take=${100}&days=${1}`)
    const result = report.Body as StockQuote[]

    return result
  }
  const onRefreshRequest = () => {
    mutate(mutateKey)
  }
  const onGoToPage = () => {
    router.push('/market/stocks/reports/volume-leaders')
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  useEffect(() => {
    if (pollCounter >= 1) {
      mutate(mutateKey)
    }
  }, [pollCounter])

  return (
    <StockListSummary
      userProfile={userProfile}
      data={data}
      title='Volume Leaders'
      isLoading={isLoading}
      onRefreshRequest={onRefreshRequest}
      showCompanyName={showCompanyName}
      onGoToPage={onGoToPage}
    />
  )
}

export default VolumeLeadersSummary
