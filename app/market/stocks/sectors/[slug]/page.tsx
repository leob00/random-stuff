import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'
import { Suspense } from 'react'
import Seo from 'components/Organizms/Seo'
import SectorPage from './SectorPage'
import { apiConnection } from 'lib/backend/api/config'
import { postBody } from 'lib/backend/api/fetchFunctions'
import { QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import { SectorIndustry } from 'lib/backend/api/qln/qlnModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { excludeFinancialInstruments } from 'lib/ui/stocks/util'
import { dedup } from 'lib/util/collectionsNative'
import { sortArray } from 'lib/util/collections'
export const dynamic = 'force-dynamic' // disable cache

export interface SectorDetailsModel {
  container: SectorIndustry
  quotes: StockQuote[]
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const config = apiConnection().qln
  const { slug } = await params
  const id = decodeURIComponent(slug)
  const resp = (await postBody(`${config.url}/Sectors`, 'POST', { Category: 'Sector', Id: id }, { ApiKey: config.key }, true)) as QlnApiResponse
  const container = resp.Body.Container as SectorIndustry
  const quotes = resp.Body.Quotes as StockQuote[]
  const filteredQuotes = excludeFinancialInstruments(quotes.filter((m) => m.MarketCap).filter((c) => c.Change !== null))

  const sortedQuotes = dedup(sortArray(filteredQuotes, ['MarketCap'], ['desc']), 'Company')
  const model: SectorDetailsModel = {
    container: container,
    quotes: sortedQuotes,
  }
  return (
    <>
      <Seo pageTitle={`Sector: ${container.Name}`} />
      <PageHeader text={`Sector: ${container.Name}`}>
        <StockMarketPageContextMenu />
      </PageHeader>
      <Suspense fallback={<ComponentLoader />}>
        <Box>
          <SectorPage data={model} />
        </Box>
      </Suspense>
    </>
  )
}
