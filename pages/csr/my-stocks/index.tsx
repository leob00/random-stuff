import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import Seo from 'components/Organizms/Seo'
import EarningsCalendarLayout from 'components/Organizms/stocks/EarningsCalendarLayout'
import EconCalendarLayout from 'components/Organizms/stocks/EconCalendarLayout'
import StocksLayout from 'components/Organizms/stocks/StocksLayout'
import { useUserController } from 'hooks/userController'
import React from 'react'
import { useRouter } from 'next/router'
import TabList from 'components/Atoms/Buttons/TabList'
import { Box } from '@mui/material'
import ContextMenu from 'components/Molecules/Menus/ContextMenu'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import { MyStocksMenu } from 'components/Atoms/Menus/ContextMenus'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import CommoditiesLayout from 'components/Organizms/stocks/CommoditiesLayout'

const Page = () => {
  const router = useRouter()
  const tab = router.query['tab'] as string | undefined

  const tabs: TabInfo[] = [{ title: 'Stocks' }, { title: 'Earnings' }]
  if (tab) {
    tabs[tabs.findIndex((m) => m.title === tab)].selected = true
  } else {
    tabs[0].selected = true
  }

  const [selectedTab, setSelectedTab] = React.useState(tab ?? 'Stocks')
  const [isLoading, setIsLoading] = React.useState(true)
  const { authProfile, fetchProfilePassive, setProfile } = useUserController()

  const localStore = useLocalStore()

  const handleSelectTab = (tab: TabInfo) => {
    setSelectedTab(tab.title)
  }

  React.useEffect(() => {
    const fn = async () => {
      if (!authProfile) {
        const fetchedProfile = await fetchProfilePassive(900)
        await setProfile(fetchedProfile)
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    }
    fn()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile])

  return (
    <>
      <Seo pageTitle='My Stocks' />
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Box></Box>
        <ContextMenu items={MyStocksMenu} />
      </Box>
      <ResponsiveContainer>
        <PageHeader text='My Stocks' />
        <TabList tabs={tabs} onSetTab={handleSelectTab} selectedTab={tabs.findIndex((m) => m.title === selectedTab)} />
        {isLoading ? (
          <BackdropLoader />
        ) : (
          <>
            {selectedTab === 'Stocks' && <StocksLayout userProfile={authProfile} localStore={localStore} />}
            {selectedTab === 'Earnings' && <EarningsCalendarLayout />}
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
