import { Box } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import EarningsCalendarDisplay from 'components/Organizms/stocks/earnings/EarningsCalendarDisplay'
import { apiConnection } from 'lib/backend/api/config'
import { QlnApiResponse, StockEarning } from 'lib/backend/api/qln/qlnApi'

export default async function EarningsCalendarPage({ data }: { data: StockEarning[] }) {
  return (
    <>
      <Box px={1} display={'flex'} pt={1} justifyContent={'space-between'} alignItems={'center'}>
        <NavigationButton path={'/market/stocks/earnings/calendar/reports'} name={'earnings report'} category='Stock Reports' variant='body2' />
      </Box>
      <Box py={2}>{data && data.length > 0 && <EarningsCalendarDisplay data={data} />}</Box>
    </>
  )
}
