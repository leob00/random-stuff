import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PagedStockTable from 'components/Organizms/stocks/PagedStockTable'
import StockTable from 'components/Organizms/stocks/StockTable'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { apiConnection } from 'lib/backend/api/config'
import { post } from 'lib/backend/api/fetchFunctions'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { SectorIndustry } from 'lib/backend/api/qln/qlnModels'
import { sortArray } from 'lib/util/collections'
import { useRouter } from 'next/router'
import { dedup } from 'lib/util/collectionsNative'
import { excludeFinancialInstruments } from 'lib/ui/stocks/util'
import React from 'react'
import { usePager } from 'hooks/usePager'
interface Model {
  container: SectorIndustry
  quotes: StockQuote[]
}

const Page = () => {
  const router = useRouter()
  const apiConn = apiConnection().qln
  const id = router.query.slug as string
  const dataFn = async () => {
    const resp = await post(`${apiConn.url}/Sectors`, { Category: 'Sector', Id: id })
    const container = resp.Body.Container as SectorIndustry
    const quotes = resp.Body.Quotes as StockQuote[]
    const filteredQuotes = excludeFinancialInstruments(quotes.filter((m) => m.MarketCap).filter((c) => c.Change !== null))

    const sortedQuotes = dedup(sortArray(filteredQuotes, ['MarketCap'], ['desc']), 'Company')
    const model: Model = {
      container: container,
      quotes: sortedQuotes,
    }
    return model
  }
  const { isLoading, data } = useSwrHelper(id, dataFn, { revalidateOnFocus: false })
  const pager = usePager(data?.quotes ?? [], 5)
  if (!data) {
    return <BackdropLoader />
  }
  return (
    <ResponsiveContainer>
      {isLoading && <BackdropLoader />}
      {data && (
        <Box>
          <PageHeader text={`${data.container.Name}`} backButtonRoute={'/csr/stocks/sectors'} />
          <Box py={2}>
            <PagedStockTable data={data.quotes} pager={pager} />
          </Box>
        </Box>
      )}
    </ResponsiveContainer>
  )
}

export default Page
