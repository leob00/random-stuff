import { Box, IconButton, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CopyableText from 'components/Atoms/Text/CopyableText'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getCacheStats, resetStockCache } from 'lib/backend/api/qln/qlnApi'
import { Claim } from 'lib/backend/auth/userUtil'
import RefreshIcon from '@mui/icons-material/Refresh'
import numeral from 'numeral'
import React from 'react'
import { mutate } from 'swr'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'
import { useSwrHelper } from 'hooks/useSwrHelper'
dayjs.extend(utc)

interface CacheStats {
  WebServerIpAddress: string
  StocksCache: {
    CreateDate: string | null
    ItemCount: number
  }
}

const CacheSettings = ({ claim }: { claim: Claim }) => {
  const mutateKey = `qln-case-stats`
  const fetchData = async () => {
    const response = await getCacheStats(claim.token ?? '')
    return response.Body as CacheStats
  }
  const { data, isLoading } = useSwrHelper(mutateKey, fetchData, { revalidateOnFocus: false })
  const handleResetCache = async () => {
    await resetStockCache(claim.token ?? '')
    mutate(mutateKey)
  }
  const handleRefresh = () => {
    mutate(mutateKey)
  }
  return (
    <>
      {isLoading && <BackdropLoader />}
      {data && (
        <Box>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography variant='h5' pb={2} color='primary'>{`Web Server Settings`}</Typography>
            <Box>
              <IconButton size='small' color='primary' onClick={handleRefresh}>
                <RefreshIcon fontSize='small' />
              </IconButton>
            </Box>
          </Box>
          <ReadOnlyField label='address' val={data.WebServerIpAddress} />
          <Box display={'flex'} alignItems={'center'}>
            <CopyableText label='Token:' value={claim.token ?? ''} />
          </Box>
          <ReadOnlyField label='Token Expiration Date' val={`${dayjs(claim.tokenExpirationDate).format('MM/DD/YYYY hh:mm a')}`} />
          <Typography variant='h5' py={2} color='primary'>{`Cache`}</Typography>
          <ReadOnlyField label='stock item count' val={`${numeral(data.StocksCache.ItemCount).format('###,###')}`} />
          <Box>
            <ReadOnlyField label='created' val={`${data.StocksCache.CreateDate ? dayjs(data.StocksCache.CreateDate).format('MM/DD/YYYY hh:mm a') : ''}`} />
          </Box>
          <Box py={2}>
            <SiteLink href='/status' text='status' />
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
