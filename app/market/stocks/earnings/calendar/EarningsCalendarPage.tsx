import { Box } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import EarningsCalendarDisplay from 'components/Organizms/stocks/earnings/EarningsCalendarDisplay'
import { apiConnection } from 'lib/backend/api/config'
import { QlnApiResponse, StockEarning } from 'lib/backend/api/qln/qlnApi'

const getData = async () => {
  const config = apiConnection().qln
  const url = `${config.url}/RecentEarnings`
  const resp = await fetch(url, {
    next: { revalidate: 1800 }, // Revalidate every 30 minutes
    headers: {
      'Content-Type': 'application/json',
      ApiKey: String(config.key),
    },
  })
  const result = (await resp.json()) as QlnApiResponse
  return result.Body as StockEarning[]
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
