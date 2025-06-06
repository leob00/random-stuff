import { Box } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { WidgetSize } from 'components/Organizms/dashboard/dashboardModel'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockEarning, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import EarningsCalendarWidgetDisplay from './EarningsCalendarWidgetDisplay'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const EarningsCalendarWidget = ({ width, height, size }: { width: number; height: number; size: WidgetSize }) => {
  const mutateKey = 'RecentEarnings'
  const dataFn = async () => {
    const resp = await serverGetFetch('/RecentEarnings')
    const body = resp.Body as StockEarning[]

    return body
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <>
      {isLoading && <ComponentLoader />}
      <Box minHeight={height} width={width}>
        {data && (
          <FadeIn>
            <Box>
              <EarningsCalendarWidgetDisplay data={data} maxHeight={200} />
            </Box>
          </FadeIn>
        )}
      </Box>
    </>
  )
}

export default EarningsCalendarWidget
