import { Box } from '@mui/material'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { NewsItem, NewsTypeIds, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { useEffect } from 'react'
import { sleep } from 'lib/util/timers'
import SummaryTitle from './SummaryTitle'
import { usePolling } from 'hooks/usePolling'
import { mutate } from 'swr'
import { getRandomInteger } from 'lib/util/numberUtil'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import NewsList from 'components/Organizms/news/NewsList'

const NewsSummary = ({ userProfile }: { userProfile: UserProfile | null }) => {
  const selectedSource: NewsTypeIds = 'BloombergMarkets'
  const mutateKey = `news-${selectedSource}`

  const endPoint = `/NewsBySource?type=${selectedSource}`
  const dataFn = async () => {
    await sleep(getRandomInteger(250, 2500))
    const resp = await serverGetFetch(endPoint)
    const body = resp.Body as NewsItem[]
    return body
  }

  const { pollCounter } = usePolling(1000 * 480) // 8 minutes

  const handleRefresh = async () => {
    mutate(mutateKey)
  }

  useEffect(() => {
    const fn = async () => {
      await sleep(getRandomInteger(250, 2500))
      mutate(mutateKey)
    }
    if (pollCounter > 1) {
      fn()
    }
  }, [pollCounter])

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <Box height={690} minWidth={{ xs: 300, sm: 600, md: 828 }}>
      <SummaryTitle title='News' onRefresh={handleRefresh} />
      <ScrollableBox maxHeight={500}>
        {isLoading && <ComponentLoader />}
        {data && <NewsList newsItems={data} userProfile={userProfile} />}
      </ScrollableBox>
    </Box>
  )
}

export default NewsSummary
