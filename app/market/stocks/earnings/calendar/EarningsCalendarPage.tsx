import { Box } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import EarningsCalendarDisplay from 'components/Organizms/stocks/earnings/EarningsCalendarDisplay'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'

const getData = async () => {
  const config = apiConnection().qln
  const url = `${config.url}/RecentEarnings`
  const resp = await get(url)
  return resp.Body as StockEarning[]
}

export default async function EarningsCalendarPage() {
  const data = await getData()
  return (
    <>
      <Box px={1} display={'flex'} pt={1} justifyContent={'space-between'} alignItems={'center'}>
        <NavigationButton path={'/market/stocks/earnings/calendar/reports'} name={'earnings report'} category='Stock Reports' variant='body2' />
      </Box>
      <Box py={2}>{data && data.length > 0 && <EarningsCalendarDisplay data={data} />}</Box>
    </>
  )
}
