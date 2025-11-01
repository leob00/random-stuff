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
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAlert from 'components/Molecules/Menus/ContextMenuAlert'
import ContextMenuPortfolio from 'components/Molecules/Menus/ContextMenuPortfolio'
import ContextMenuPeople from 'components/Molecules/Menus/ContextMenuPeople'
import ContextMenuReport from 'components/Molecules/Menus/ContextMenuReport'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import CommoditiesLayout from 'components/Organizms/stocks/CommoditiesLayout'
import ContextMenuAllStocks from 'components/Molecules/Menus/ContextMenuAllStocks'

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
  const contextMenu: ContextMenuItem[] = [
    {
      item: (
        <>
          <ContextMenuAllStocks />
        </>
      ),
      fn: () => router.push('/csr/community-stocks'),
    },
    {
      item: (
        <>
          <ContextMenuPortfolio text={'portfolio'} />
        </>
      ),
      fn: () => router.push('/csr/stocks/stock-porfolios'),
    },
    {
      item: (
        <>
          <ContextMenuAlert text='manage alerts' />
        </>
      ),
      fn: () => router.push('/csr/stocks/alerts'),
    },
    {
      item: (
        <>
          <ContextMenuReport text='reports' />
        </>
      ),
      fn: () => router.push(`/ssg/stocks/reports/volume-leaders`),
    },
  ]

  React.useEffect(() => {
    const fn = async () => {
      if (!authProfile) {
        const p = await fetchProfilePassive(900)
        if (!p) {
        }
        await setProfile(p)
      }
      setIsLoading(false)
    }
    fn()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile])

  return (
    <>
      <Seo pageTitle='Stocks' />
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <BackButton />
        <ContextMenu items={contextMenu} />
      </Box>

      <ResponsiveContainer>
        <TabList tabs={tabs} onSetTab={handleSelectTab} selectedTab={tabs.findIndex((m) => m.title === selectedTab)} />
        {isLoading ? (
          <BackdropLoader />
        ) : (
          <>
            {selectedTab === 'Stocks' && (
              <>
                <StocksLayout userProfile={authProfile} localStore={localStore} />
              </>
            )}
            {selectedTab === 'Futures' && <CommoditiesLayout />}
            {selectedTab === 'Events' && <EconCalendarLayout />}
            {selectedTab === 'Earnings' && <EarningsCalendarLayout />}
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
