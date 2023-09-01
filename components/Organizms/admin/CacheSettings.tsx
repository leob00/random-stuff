import { Box, Card, CardContent, CardHeader, Paper, Typography } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getCacheStats } from 'lib/backend/api/qln/qlnApi'
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
  const { data, isLoading, isValidating, error } = useSWR(mutateKey, ([url, id]) => fetchData(url, claim.token))
  //console.log(data)
  return (
    <>
      {isValidating && <BackdropLoader />}
      {data && (
        <Box>
          {/* <JsonView obj={data} /> */}
          <Paper>
            <Card>
              <CardContent>
                <Typography>{`Web Server Address: ${data.WebServerIpAddress}`}</Typography>
                <Typography variant='h5' pt={2}>{`Cache`}</Typography>
                <Typography>{`Stock Item Count: ${numeral(data.StocksCache.ItemCount).format('###,###')}`}</Typography>
                <Typography>{`Create Date: ${data.StocksCache.CreateDate ? dayjs(data.StocksCache.CreateDate).format('MM/DD/YYYY hh:mm a') : ''}`}</Typography>
              </CardContent>
            </Card>
          </Paper>
        </Box>
      )}
    </>
  )
}

export default CacheSettings
