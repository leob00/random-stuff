import { Box, Button, Typography } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { WidgetSize } from 'components/Organizms/dashboard/dashboardModel'
import StockEarningsCalendarDetails from 'components/Organizms/stocks/earnings/StockEarningsCalendarDetails'
import StockEarningsCalendarList from 'components/Organizms/stocks/earnings/StockEarningsCalendarList'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockEarning, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import { useRouter } from 'next/navigation'

const EarningsCalendarWidget = ({ width, height, size }: { width: number; height: number; size: WidgetSize }) => {
  const router = useRouter()
  const mutateKey = 'RecentEarnings'
  const dataFn = async () => {
    const resp = await serverGetFetch('/RecentEarnings')
    const body = resp.Body as StockEarning[]

    return body
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <Box py={2} minHeight={height} width={width}>
      {data && !isLoading && (
        <Box>
          <StockEarningsCalendarList data={data} />
          <HorizontalDivider />
          <Box py={1} px={2}>
            <Button
              variant='text'
              onClick={() => {
                router.push(`/csr/stocks/earnings-calendar`)
              }}
            >
              <Typography variant={'body2'}>details &raquo;</Typography>
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default EarningsCalendarWidget
