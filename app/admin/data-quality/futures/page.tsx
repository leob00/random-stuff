import BackButton from 'components/Atoms/Buttons/BackButton'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import AdminEarningsWrapper from 'components/Organizms/admin/data-quality/earnings/AdminEarningsWrapper'
import AdminFuturesWrapper from 'components/Organizms/admin/data-quality/futures/AdminFuturesWrapper'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { QlnApiResponse, TickerType } from 'lib/backend/api/qln/qlnApi'
import { Suspense } from 'react'

const conn = apiConnection().qln

const getData = async () => {
  const resp = (await get(`${conn.url}/TickerTypes`)) as QlnApiResponse
  const result = resp.Body as TickerType[]
  return result
}
export default async function Page() {
  const data = await getData()
  return (
    <>
      <PageHeader text={'Data Quality - Futures'} />
      <BackButton route='/admin/data-quality' text='Data Quality' />
      <Suspense fallback={<ComponentLoader />}>{<AdminFuturesWrapper tickers={data} />}</Suspense>
    </>
  )
}
