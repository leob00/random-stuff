import { Box, Button, Typography } from '@mui/material'
import CircleLoader from 'components/Atoms/Loaders/CircleLoader'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getEconDataReport } from 'lib/backend/api/qln/qlnApi'
import EconIndexChart from './EconIndexChart'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { useRouter } from 'next/router'

const EconIndexWidget = ({ itemId, symbol, width, height }: { itemId: number; symbol: string; width: number; height: number }) => {
  const router = useRouter()
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
  const { data, isLoading } = useSwrHelper(key, dataFn, { revalidateOnFocus: false })
  return (
    <Box py={2} minHeight={height}>
      {isLoading && <CircleLoader />}
      {data && (
        <Box>
          <EconIndexChart data={data} symbol={symbol} width={width} days={90} />
          <HorizontalDivider />
          <Box py={1} px={2}>
            <Button
              variant='text'
              onClick={() => {
                router.push(`/csr/economic-indicators/${itemId}`)
              }}>
              <Typography variant={'body2'}>details &raquo;</Typography>
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default EconIndexWidget
