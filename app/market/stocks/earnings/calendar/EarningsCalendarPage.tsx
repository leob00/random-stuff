import { Box } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import EarningsCalendarDisplay from 'components/Organizms/stocks/earnings/EarningsCalendarDisplay'
import EarningsCalendarLayout from 'components/Organizms/stocks/EarningsCalendarLayout'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'

export default async function EarningsCalendarPage() {
  return (
    <>
      <Box px={1} display={'flex'} pt={1} justifyContent={'space-between'} alignItems={'center'}>
        <NavigationButton path={'/market/stocks/earnings/calendar/reports'} name={'earnings report'} category='Stock Reports' variant='body2' />
      </Box>
      <Box py={2}>
        <EarningsCalendarLayout />
      </Box>
    </>
  )
}
