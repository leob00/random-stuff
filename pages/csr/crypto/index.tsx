import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAllStocks from 'components/Molecules/Menus/ContextMenuAllStocks'
import ContextMenuCommodities from 'components/Molecules/Menus/ContextMenuCommodities'
import ContextMenuMyStocks from 'components/Molecules/Menus/ContextMenuMyStocks'
import Seo from 'components/Organizms/Seo'
import CryptosDisplay from 'components/Organizms/crypto/CryptosDisplay'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { useRouter } from 'next/navigation'

const Page = () => {
  const mutateKey = 'cryptos-all'
  const router = useRouter()
  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuAllStocks text={'stocks'} />,
      fn: () => router.push('/csr/community-stocks'),
    },
    {
      item: <ContextMenuMyStocks />,
      fn: () => router.push('/csr/my-stocks'),
    },
    {
      item: <ContextMenuCommodities text={'commodities'} />,
      fn: () => router.push('/csr/commodities'),
    },
  ]

  const dataFn = async () => {
    const resp = await serverGetFetch('/Crypto')
    const result = resp.Body as StockQuote[]
    return result
  }
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  const { userProfile, isValidating: profileLoading } = useProfileValidator()

  return (
    <ResponsiveContainer>
      <Seo pageTitle='Crypto' />
      <Box minHeight={500}>
        <PageHeader text='Crypto' menu={menu} />
        {(isLoading || profileLoading) && <BackdropLoader />}
        <Box py={2} display={'flex'} justifyContent={'center'}>
          <AlertWithHeader severity='warning' header='' text='prices are delayed by one day' />
        </Box>
        {data && !profileLoading && <CryptosDisplay data={data} userProfile={userProfile} />}
      </Box>
    </ResponsiveContainer>
  )
}

export default Page
