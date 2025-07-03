import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { SectorIndustry } from 'lib/backend/api/qln/qlnModels'
import { sortArray } from 'lib/util/collections'
import { useRouter } from 'next/router'
import { dedup } from 'lib/util/collectionsNative'
import { excludeFinancialInstruments } from 'lib/ui/stocks/util'
import SortableStockContainer from 'components/Organizms/stocks/SortableStockContainer'
import MovingAvgValues from 'components/Organizms/stocks/movingAvg/MovingAvgValues'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { QlnApiRequest, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
interface Model {
  container: SectorIndustry
  quotes: StockQuote[]
}

const Page = () => {
  const router = useRouter()
  const id = router.query.slug as string
  const dataFn = async () => {
    const req: QlnApiRequest = {
      key: id,
      body: { Category: 'Sector', Id: id },
    }
    const resp = await serverPostFetch({ key: id, body: { Category: 'Sector', Id: id } }, '/Sectors')
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

  return (
    <ResponsiveContainer>
      {isLoading && <BackdropLoader />}
      {data && (
        <>
          {data.quotes.length > 0 ? (
            <Box>
              <PageHeader text={`${data.container.Name}`} backButtonRoute={'/csr/stocks/sectors'} />
              <Box py={2}>
                <MovingAvgValues values={data.container.MovingAvg} />
                <SortableStockContainer data={data.quotes} />
              </Box>
            </Box>
          ) : (
            <>
              <PageHeader text={``} backButtonRoute={'/csr/stocks/sectors'} />
              <NoDataFound />
            </>
          )}
        </>
      )}
    </ResponsiveContainer>
  )
}

export default Page
