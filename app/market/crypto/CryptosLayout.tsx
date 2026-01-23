'use client'

import { Box } from '@mui/material'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import CryptosDisplay from 'components/Organizms/crypto/CryptosDisplay'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'

const CryptosLayout = () => {
  const mutateKey = 'crypto'
  const dataFn = async () => {
    const endPoint = `/Crypto`

    const resp = await serverGetFetch(endPoint)
    const quotes = resp.Body as StockQuote[]
    return quotes
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box>
      {isLoading && <ComponentLoader />}
      {data && <CryptosDisplay data={data} userProfile={null} />}
    </Box>
  )
}

export default CryptosLayout
