import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'
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

      <ResponsiveContainer>
        <PageHeader text='Earnings Calendar'>
          <StockMarketPageContextMenu />
        </PageHeader>
        {isLoading && <ComponentLoader />}
        <ScrollIntoView />
        <Box px={1} display={'flex'} pt={1} justifyContent={'space-between'} alignItems={'center'}>
          <NavigationButton path={'/csr/stocks/earnings-reports'} name={'earnings report'} category='Stock Reports' variant='body2' />
        </Box>
        <Box py={2}>{data && data.length > 0 && <EarningsCalendarDisplay data={data} />}</Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
