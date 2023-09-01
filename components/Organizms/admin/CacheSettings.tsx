import { Box, Card, CardContent, CardHeader, Paper, Typography } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getCacheStats, resetStockCache } from 'lib/backend/api/qln/qlnApi'
import { Claim } from 'lib/backend/auth/userUtil'
import numeral from 'numeral'
import React from 'react'
import useSWR, { mutate } from 'swr'
dayjs.extend(utc)

interface CacheStats {
  WebServerIpAddress: string
  StocksCache: {
    CreateDate: string | null
    ItemCount: number
  }
}

const CacheSettings = ({ claim }: { claim: Claim }) => {
  const mutateKey = ['/api/baseRoute', claim.token]
  const fetchData = async (url: string, id: string) => {
    const result = await getCacheStats(claim.token)
    return result.Body as CacheStats
  }
  const { data, isValidating } = useSWR(mutateKey, ([url, id]) => fetchData(url, claim.token))
  const [isLoading, setIsLoading] = React.useState(false)
  const handleResetCache = async () => {
    setIsLoading(true)
    await resetStockCache(claim.token)
    setIsLoading(false)
    mutate(mutateKey)
  }
  return (
    <>
      {isValidating && <BackdropLoader />}
      {data && (
        <Paper sx={{ p: 2 }} elevation={6}>
          {/* <JsonView obj={data} /> */}

          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Typography>{`Web Server Address: ${data.WebServerIpAddress}`}</Typography>
            <Typography variant='h5' pt={2}>{`Cache`}</Typography>
            <Typography>{`Stock Item Count: ${numeral(data.StocksCache.ItemCount).format('###,###')}`}</Typography>
            <Typography>{`Create Date: ${data.StocksCache.CreateDate ? dayjs(data.StocksCache.CreateDate).format('MM/DD/YYYY hh:mm a') : ''}`}</Typography>
          </Box>
          <Box py={2}>
            {isLoading && <BackdropLoader />}
            <PrimaryButton text='Reset' onClick={handleResetCache} disabled={isLoading} />
          </Box>
        </Paper>
      )}
    </>
  )
}

export default CacheSettings
