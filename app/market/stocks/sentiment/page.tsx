import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'
import StockSentimentPage from './StockSentimentPage'

export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <Seo pageTitle='Stock Market Sentiment' />
      <PageHeader text='Stock Market Sentiment'>
        <StockMarketPageContextMenu />
      </PageHeader>
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <StockSentimentPage />
        </Suspense>
      </Box>
    </>
  )
}
