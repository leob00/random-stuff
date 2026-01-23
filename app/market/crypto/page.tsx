import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

import OtherMarketsPageContextMenu from 'components/Molecules/Menus/OtherMarketsPageContextMenu'
import CryptoPage from './CryptoPage'
import { apiConnection } from 'lib/backend/api/config'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { QlnApiResponse } from 'lib/backend/api/qln/qlnApi'

//export const dynamic = 'force-dynamic' // disable cache
//export const revalidate = 1800 // Revalidate every 30 minutes
//export const revalidate = 600 // revalidate every 10 minutes

export default async function Page() {
  return (
    <>
      <PageHeader text='Crypto'>
        <OtherMarketsPageContextMenu />
      </PageHeader>
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <CryptoPage />
        </Suspense>
      </Box>
    </>
  )
}
