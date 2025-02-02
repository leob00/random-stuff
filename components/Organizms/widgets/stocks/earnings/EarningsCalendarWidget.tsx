import { Box, Button, Typography } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { WidgetSize } from 'components/Organizms/dashboard/dashboardModel'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockEarning, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { useRouter } from 'next/navigation'
import EarningsCalendarWidgetDisplay from './EarningsCalendarWidgetDisplay'

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
    <>
      <Box minHeight={height} width={width}>
        {data && (
          <FadeIn>
            <Box>
              <EarningsCalendarWidgetDisplay data={data} maxHeight={200} />
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
          </FadeIn>
        )}
      </Box>
    </>
  )
}

export default EarningsCalendarWidget
