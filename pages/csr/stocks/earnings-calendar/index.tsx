import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
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
        <Box py={2}>
          {!isLoading && data && data.length === 0 && <NoDataFound />}
          {data && data.length > 0 && <EarningsCalendarDisplay data={data} />}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
