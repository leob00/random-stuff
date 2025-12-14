import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { NewsItem, NewsTypeIds, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import { useEffect, useState } from 'react'
import StockListItem, { getPositiveNegativeColor } from '../StockListItem'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import { sleep } from 'lib/util/timers'
import { sortArray } from 'lib/util/collections'
import SummaryTitle from './SummaryTitle'
import { usePolling } from 'hooks/usePolling'
import { mutate } from 'swr'
import { filterCryptos } from 'components/Organizms/crypto/CryptosDisplay'
import { getRandomInteger } from 'lib/util/numberUtil'
import ScrollableBoxHorizontal from 'components/Atoms/Containers/ScrollableBoxHorizontal'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
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

  useEffect(() => {
    const fn = async () => {
      await sleep(250)
      mutate(mutateKey)
    }
    fn()
  }, [pollCounter])

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <Box height={600} minWidth={{ xs: 300, sm: 600, md: 800 }}>
      <SummaryTitle title='News' />
      <ScrollableBox>
        {isLoading && (
          <Box display={'flex'} justifyContent={'center'}>
            <ComponentLoader />
          </Box>
        )}
        {data && <NewsList newsItems={data} userProfile={userProfile} />}
      </ScrollableBox>
    </Box>
  )
}

export default NewsSummary
