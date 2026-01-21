import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'
import EarningsCalendarPage from './EarningsCalendarPage'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'
import { apiConnection } from 'lib/backend/api/config'
import { QlnApiResponse, StockEarning } from 'lib/backend/api/qln/qlnApi'

//export const dynamic = 'force-dynamic' // disable cache
const config = apiConnection().qln

export default async function Page() {
  const url = `${config.url}/RecentEarnings`
  const resp = await fetch(url, {
    next: { revalidate: 1800 }, // Revalidate every 30 minutes
    headers: {
      'Content-Type': 'application/json',
      ApiKey: String(config.key),
    },
  })
  const result = (await resp.json()) as QlnApiResponse
  const data = result.Body as StockEarning[]
  return (
    <>
      <Seo pageTitle='Earnings Calendar' />
      <PageHeader text='Earnings Calendar'>
        <StockMarketPageContextMenu />
      </PageHeader>
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <EarningsCalendarPage data={data} />
        </Suspense>
      </Box>
    </>
  )
}
