import { Box, Typography } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import { getCacheStats, getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { Claim } from 'lib/backend/auth/userUtil'
import React from 'react'
import useSWR, { mutate } from 'swr'

const QlnAdministration = ({ claim }: { claim: Claim }) => {
  const mutateKey = ['/api/baseRoute', claim.token]
  const fetchData = async (url: string, id: string) => {
    const result = await getCacheStats(claim.token)
    return result.Body
  }
  const { data, isLoading, isValidating } = useSWR(mutateKey, ([url, id]) => fetchData(url, claim.token))
  console.log(data)
  return (
    <Box>
      <Box>
        <CenteredTitle title='QLN Admin' />
      </Box>
      {isValidating && <BackdropLoader />}
      {data && <JsonView obj={data} />}
    </Box>
  )
}

export default QlnAdministration
