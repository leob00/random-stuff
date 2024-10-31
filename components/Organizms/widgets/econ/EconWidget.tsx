import { Box, Typography } from '@mui/material'
import CircleLoader from 'components/Atoms/Loaders/CircleLoader'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getEconDataReport } from 'lib/backend/api/qln/qlnApi'
import EconIndexChart from './EconIndexChart'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { WidgetSize } from 'components/Organizms/dashboard/dashboardModel'
import CenterStack from 'components/Atoms/CenterStack'
import EconChart from './EconChart'

const EconWidget = ({ itemId, symbol, width, height, size }: { itemId: number; symbol: string; width: number; height: number; size: WidgetSize }) => {
  //const startYear = size != 'sm' ? dayjs().subtract(1, 'year').year() : undefined
  //const endYear = size != 'sm' ? dayjs().year() : undefined
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
          <EconChart data={data} symbol={symbol} width={width} days={90} />

          {size !== 'sm' ? (
            <></>
          ) : (
            <>
              {/* <Box display={'flex'} flexDirection={'column'} gap={2}>
                <Typography variant='h5' textAlign={'center'} fontWeight={600}>
                  {data.Value.toFixed(2)}
                </Typography>
                <Typography variant='caption' textAlign={'center'}>
                  {`as of: ${dayjs(data.LastObservationDate).format('MM/DD/YYYY')}`}
                </Typography>
              </Box> */}
            </>
          )}
          <HorizontalDivider />
          <Box py={1} px={2}>
            <NavigationButton route={`/csr/economic-indicators/${itemId}`} text={'details'} variant={'body2'} />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default EconWidget
