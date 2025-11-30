import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import Seo from 'components/Organizms/Seo'
import StocksLayout from 'components/Organizms/stocks/StocksLayout'
import { Box } from '@mui/material'
import ContextMenu from 'components/Molecules/Menus/ContextMenu'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import { myStocksMenu } from 'components/Atoms/Menus/ContextMenus'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const Page = () => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  const localStore = useLocalStore()

  return (
    <>
      <Seo pageTitle='My Stocks' />

      <ResponsiveContainer>
        <PageHeader text='My Stocks'>
          <StockMarketPageContextMenu />
        </PageHeader>
        {isValidatingProfile ? <ComponentLoader mt={20} /> : <StocksLayout userProfile={userProfile} localStore={localStore} />}
      </ResponsiveContainer>
    </>
  )
}

export default Page
