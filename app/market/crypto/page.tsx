import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

import Seo from 'components/Organizms/Seo'
import OtherMarketsPageContextMenu from 'components/Molecules/Menus/OtherMarketsPageContextMenu'
import CryptoPage from './CryptoPage'

//export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <Seo pageTitle='Crypto' />
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
