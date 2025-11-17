import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAllStocks from 'components/Molecules/Menus/ContextMenuAllStocks'
import ContextMenuCrypto from 'components/Molecules/Menus/ContextMenuCrypto'
import ContextMenuMyStocks from 'components/Molecules/Menus/ContextMenuMyStocks'
import Seo from 'components/Organizms/Seo'
import CommoditiesLayout from 'components/Organizms/stocks/CommoditiesLayout'
import { useRouter } from 'next/navigation'

const index = () => {
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
      item: <ContextMenuCrypto text={'crypto'} />,
      fn: () => router.push('/csr/crypto'),
    },
  ]
  return (
    <>
      <Seo pageTitle='Commodities' />
      <ResponsiveContainer>
        <PageHeader text='Commodities' menu={menu} />
        <CommoditiesLayout />
      </ResponsiveContainer>
    </>
  )
}

export default index
