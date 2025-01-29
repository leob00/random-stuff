import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import EarningsCalendarDisplay from 'components/Organizms/stocks/earnings/EarningsCalendarDisplay'

import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockEarning, serverGetFetch } from 'lib/backend/api/qln/qlnApi'

const Page = () => {
  const mutateKey = 'RecentEarnings'
  const dataFn = async () => {
    const resp = await serverGetFetch('/RecentEarnings')
    return resp.Body as StockEarning[]
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <>
      <Seo pageTitle='Earnings Calendar' />
      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <PageHeader text='Earnings Calendar' />
        <Box px={1} display={'flex'} pt={1} justifyContent={'flex-end'} alignItems={'center'}>
          <NavigationButton path={'/csr/stocks/earnings-reports'} name={'reports'} category='Reports' variant='body2' />
        </Box>
        <Box py={2}>{data && data.length > 0 && <EarningsCalendarDisplay data={data} />}</Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
