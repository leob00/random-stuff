import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAllStocks from 'components/Molecules/Menus/ContextMenuAllStocks'
import ContextMenuMyStocks from 'components/Molecules/Menus/ContextMenuMyStocks'
import StockMarketMenu from 'components/Molecules/Menus/StockMarketMenu'
import Seo from 'components/Organizms/Seo'
import EarningsCalendarDisplay from 'components/Organizms/stocks/earnings/EarningsCalendarDisplay'

import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockEarning, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { useRouter } from 'next/navigation'

const Page = () => {
  const mutateKey = 'RecentEarnings'
  const router = useRouter()
  const dataFn = async () => {
    const resp = await serverGetFetch('/RecentEarnings')
    return resp.Body as StockEarning[]
  }

  const menu: ContextMenuItem[] = [
    {
      fn: () => router.push('/csr/community-stocks'),
      item: <ContextMenuAllStocks />,
    },
    {
      fn: () => router.push('/csr/community-stocks'),
      item: <ContextMenuMyStocks />,
    },
  ]

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <>
      <Seo pageTitle='Earnings Calendar' />
      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <PageHeader text='Earnings Calendar' menu={menu} />
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
