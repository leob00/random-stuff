import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import Seo from 'components/Organizms/Seo'
import EarningsCalendarLayout from 'components/Organizms/stocks/EarningsCalendarLayout'
import StocksLayout from 'components/Organizms/stocks/StocksLayout'
import { useState } from 'react'
import { useRouter } from 'next/router'
import TabList from 'components/Atoms/Buttons/TabList'
import { Box } from '@mui/material'
import ContextMenu from 'components/Molecules/Menus/ContextMenu'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import { myStocksMenu } from 'components/Atoms/Menus/ContextMenus'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const Page = () => {
  const router = useRouter()
  const { userProfile, isValidating } = useProfileValidator()

  const tab = router.query['tab'] as string | undefined

  const tabs: TabInfo[] = [{ title: 'Stocks' }, { title: 'Earnings' }]
  if (tab) {
    tabs[tabs.findIndex((m) => m.title === tab)].selected = true
  } else {
    tabs[0].selected = true
  }

  const [selectedTab, setSelectedTab] = useState(tab ?? 'Stocks')

  const localStore = useLocalStore()

  const handleSelectTab = (tab: TabInfo) => {
    setSelectedTab(tab.title)
  }

  return (
    <>
      <Seo pageTitle='My Stocks' />
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Box></Box>
        <ContextMenu items={myStocksMenu} />
      </Box>
      <ResponsiveContainer>
        <PageHeader text='My Stocks' />
        <TabList tabs={tabs} onSetTab={handleSelectTab} selectedTab={tabs.findIndex((m) => m.title === selectedTab)} />
        {isValidating ? (
          <BackdropLoader />
        ) : (
          <>
            {selectedTab === 'Stocks' && <StocksLayout userProfile={userProfile} localStore={localStore} />}
            {selectedTab === 'Earnings' && <EarningsCalendarLayout />}
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
