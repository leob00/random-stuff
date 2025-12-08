'use client'
import { Box, useTheme } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { usePolling } from 'hooks/usePolling'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'
import { convertUtcToUsEasternDateTime } from 'lib/util/dateUtil'
import { useEffect, useState } from 'react'
import StockMarketCountdown from './StockMarketCountdown'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
const getData = async () => {
  const resp = await serverGetFetch('/MarketHandshake')
  return resp.Body as MarketHandshake
}

const StockMarketSummaryDisplay = ({ data }: { data: MarketHandshake }) => {
  const [handshake, setHandchake] = useState(data)
  const [isLoading, setIsLoading] = useState(false)

  const { pollCounter } = usePolling(1000 * 30)

  useEffect(() => {
    const fn = async () => {
      setIsLoading(true)
      const result = await getData()
      setHandchake(result)
      setIsLoading(false)
    }
    fn()
  }, [pollCounter])

  const theme = useTheme()
  return (
    <Box>
      <Box py={2} px={2} sx={{ border: `solid ${CasinoBlueTransparent} 1px` }} borderRadius={2} width={{ xs: '100%', sm: '25%', md: '14%', lg: '14%' }}>
        <Box>
          <ReadOnlyField
            variant='caption'
            label='status'
            val={`${handshake.IsOpen ? 'OPEN' : 'CLOSED'}`}
            color={`${handshake.IsOpen ? theme.palette.success.main : theme.palette.warning.main}`}
          />
        </Box>
        <Box>
          <StockMarketCountdown data={handshake} />
        </Box>
      </Box>
    </Box>
  )
}

export default StockMarketSummaryDisplay
