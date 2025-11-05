import { Box, IconButton, Typography } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CopyableText from 'components/Atoms/Text/CopyableText'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getCacheStats, resetStockCache } from 'lib/backend/api/qln/qlnApi'
import { Claim } from 'lib/backend/auth/userUtil'
import RefreshIcon from '@mui/icons-material/Refresh'
import numeral from 'numeral'
import { mutate } from 'swr'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import WarningButton from 'components/Atoms/Buttons/WarningButton'
import { useState } from 'react'
import StopWarningDialog from 'components/Atoms/Dialogs/StopWarningDialog'
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
  const [isWaiting, setIswaiting] = useState(false)
  const [showResetCacheConfirm, setShowRefreshCacheConfirm] = useState(false)

  const handleResetCache = async () => {
    setShowRefreshCacheConfirm(false)
    setIswaiting(true)
    await resetStockCache(claim.token ?? '')
    mutate(mutateKey)
    setIswaiting(false)
  }
  const handleRefresh = () => {
    mutate(mutateKey)
  }
  return (
    <Box>
      {isLoading && <BackdropLoader />}

      <Box display={'flex'} flexDirection={'column'} gap={1}>
        <Box sx={{ border: `solid ${CasinoBlueTransparent} 1px` }} borderRadius={1} p={2}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography variant='h5' pb={2} color='primary'>{`QLN Web Server`}</Typography>
            <Box>
              <IconButton size='small' color='primary' onClick={handleRefresh}>
                <RefreshIcon fontSize='small' />
              </IconButton>
            </Box>
          </Box>
          <ReadOnlyField label='IP' val={data?.WebServerIpAddress ?? ''} />
          <Box display={'flex'} alignItems={'center'}>
            <CopyableText label='Token:' value={claim.token ?? ''} />
          </Box>
          <ReadOnlyField label='Token Expiration Date' val={`${dayjs(claim.tokenExpirationDate).format('MM/DD/YYYY hh:mm a')}`} />
        </Box>
        <Box sx={{ border: `solid ${CasinoBlueTransparent} 1px` }} borderRadius={1} p={2} minHeight={220}>
          {data && (
            <>
              <Typography variant='h5' py={2} color='primary'>{`Cache`}</Typography>
              <ReadOnlyField label='stock item count' val={`${numeral(data.StocksCache.ItemCount).format('###,###')}`} />
              <Box>
                <ReadOnlyField label='created' val={`${data.StocksCache.CreateDate ? dayjs(data.StocksCache.CreateDate).format('MM/DD/YYYY hh:mm a') : ''}`} />
              </Box>

              <Box py={2}>
                <WarningButton text='Reset' onClick={() => setShowRefreshCacheConfirm(true)} loading={isLoading || isWaiting} />
              </Box>
            </>
          )}
        </Box>
      </Box>
      {showResetCacheConfirm && (
        <StopWarningDialog
          fullScreen={false}
          show={showResetCacheConfirm}
          title='Warning'
          onCancel={() => setShowRefreshCacheConfirm(false)}
          onSave={handleResetCache}
        >
          <Box>
            <Typography>Are you sure you want to reset the cache?</Typography>
          </Box>
        </StopWarningDialog>
      )}
    </Box>
  )
}

export default CacheSettings
