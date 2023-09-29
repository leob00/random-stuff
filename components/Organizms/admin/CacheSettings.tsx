import { Box, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CopyableText from 'components/Atoms/Text/CopyableText'
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
    const response = await getCacheStats(claim.token)

    return response.Body as CacheStats
  }
  const { data, isValidating, error } = useSWR(mutateKey, ([url, id]) => fetchData(url, claim.token))
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
        <Box>
          <Typography variant='h5' pb={2}>{`Web Server Settings`}</Typography>
          <Box display={'flex'} flexDirection={'column'} gap={2} justifyItems={'center'}>
            <Typography>{`Address: ${data.WebServerIpAddress}`}</Typography>
            <Box display={'flex'} alignItems={'center'}>
              <CopyableText label='Token:' value={claim.token} />
            </Box>
            <Typography>{`Token Expiration Date: ${dayjs(claim.tokenExpirationDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
            <Typography variant='h5' pt={2}>{`Cache`}</Typography>
            <Typography>{`Stock Item Count: ${numeral(data.StocksCache.ItemCount).format('###,###')}`}</Typography>
            <Typography>{`Create Date: ${data.StocksCache.CreateDate ? dayjs(data.StocksCache.CreateDate).format('MM/DD/YYYY hh:mm a') : ''}`}</Typography>
          </Box>
          <Box py={2}>
            {isLoading && <BackdropLoader />}
            <PrimaryButton text='Reset' onClick={handleResetCache} disabled={isLoading} />
          </Box>
        </Box>
      )}
    </>
  )
}

export default CacheSettings
