import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getEconDataReport } from 'lib/backend/api/qln/qlnApi'
import { WidgetSize } from 'components/Organizms/dashboard/dashboardModel'
import EconChart from './EconChart'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const EconWidget = ({ itemId, symbol, width, height, size }: { itemId: number; symbol: string; width: number; height: number; size?: WidgetSize }) => {
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

  const shouldReverseColor = reverseColor(itemId)
  const { data, isLoading } = useSwrHelper(key, dataFn, { revalidateOnFocus: false })
  return (
    <Box minHeight={height}>
      {isLoading && <ComponentLoader />}
      {data && (
        <Box>
          {data.LastObservationDate && (
            <Box>
              <Box display={'flex'} alignItems={'center'} gap={1} justifyContent={'center'}>
                <Typography variant='body2' fontWeight={400} textAlign={'center'}>{`${dayjs(data.LastObservationDate).format('MM/DD/YYYY')}`}</Typography>
              </Box>
            </Box>
          )}
          <EconChart data={data} symbol={symbol} reverseColor={shouldReverseColor} showDateSummary={false} isExtraSmall={size === 'sm'} />
        </Box>
      )}
    </Box>
  )
}

export function reverseColor(itemId: number) {
  const positiveIsGood = [5, 7, 11, 12, 13, 14, 15, 17, 34, 41, 47, 48]
  const reverseColor = !positiveIsGood.includes(itemId)
  return reverseColor
}

export default EconWidget
