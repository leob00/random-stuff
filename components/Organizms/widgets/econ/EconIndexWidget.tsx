import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getEconDataReport } from 'lib/backend/api/qln/qlnApi'
import EconIndexChart from './EconIndexChart'

const EconIndexWidget = ({ itemId, symbol, width, height }: { itemId: number; symbol: string; width: number; height: number }) => {
  const startYear = dayjs().subtract(1, 'year').year()
  const endYear = dayjs().year()
  const key = `economic-data-${itemId}-${startYear}-${endYear}`
  const dataFn = async () => {
    const data = await getEconDataReport(itemId, startYear, endYear)
    data.criteria = {
      id: String(data.InternalId),
      endYear: Number(endYear),
      startYear: Number(startYear),
    }

    return data
  }
  const { data } = useSwrHelper(key, dataFn, { revalidateOnFocus: false })
  return (
    <Box minHeight={height} width={width}>
      {data && (
        <Box minHeight={height} width={width}>
          {data.LastObservationDate && (
            <Box>
              <Box display={'flex'} alignItems={'center'} gap={1} justifyContent={'center'}>
                <Typography variant='body2' fontWeight={400} textAlign={'center'}>{`${dayjs(data.LastObservationDate).format('MM/DD/YYYY')}`}</Typography>
              </Box>
            </Box>
          )}
          <EconIndexChart data={data} symbol={symbol} width={width} days={90} showDateSummary={false} />
        </Box>
      )}
    </Box>
  )
}

export default EconIndexWidget
