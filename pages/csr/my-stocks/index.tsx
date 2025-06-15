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

const Page = () => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  const localStore = useLocalStore()

  return (
    <>
      <Seo pageTitle='My Stocks' />
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
        <Box>
          <ContextMenu items={myStocksMenu} />
        </Box>
      </Box>
      <ResponsiveContainer>
        <PageHeader text='My Stocks' />
        {isValidatingProfile ? <BackdropLoader /> : <StocksLayout userProfile={userProfile} localStore={localStore} />}
      </ResponsiveContainer>
    </>
  )
}

export default Page
