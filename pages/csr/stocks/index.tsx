import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import Seo from 'components/Organizms/Seo'
import EarningsCalendarLayout from 'components/Organizms/stocks/EarningsCalendarLayout'
import EconCalendarLayout from 'components/Organizms/stocks/EconCalendarLayout'
import FuturesLayout from 'components/Organizms/stocks/FuturesLayout'
import StocksLayout from 'components/Organizms/stocks/StocksLayout'
import { useUserController } from 'hooks/userController'
import React from 'react'
import { useRouter } from 'next/router'
import TabList from 'components/Atoms/Buttons/TabList'
import RequireClaim from 'components/Organizms/user/RequireClaim'
import { Box, ListItemText } from '@mui/material'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAlert from 'components/Molecules/Menus/ContextMenuAlert'
import ContextMenuPortfolio from 'components/Molecules/Menus/ContextMenuPortfolio'
import ContextMenuPeople from 'components/Molecules/Menus/ContextMenuPeople'

const Page = () => {
  const router = useRouter()
  const tab = router.query['tab'] as string | undefined

  const tabs: TabInfo[] = [{ title: 'Stocks' }, { title: 'Futures' }, { title: 'Earnings' }]
  if (tab) {
    tabs[tabs.findIndex((m) => m.title === tab)].selected = true
  } else {
    tabs[0].selected = true
  }

  const [selectedTab, setSelectedTab] = React.useState(tab ?? 'Stocks')
  const [loading, setLoading] = React.useState(true)
  const { authProfile, fetchProfilePassive, setProfile } = useUserController()

  const handleSelectTab = (tab: TabInfo) => {
    setSelectedTab(tab.title)
  }
  const contextMenu: ContextMenuItem[] = [
    {
      item: (
        <>
          <ContextMenuPeople text={'community stocks'} />
        </>
      ),
      fn: () => router.push('/ssg/community-stocks'),
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
  ]

  React.useEffect(() => {
    let isLoaded = false
    if (!isLoaded) {
      const fn = async () => {
        if (!authProfile) {
          const p = await fetchProfilePassive(900)
          if (!p) {
          }
          await setProfile(p)
        }
        setLoading(false)
      }
      fn()
    }
    return () => {
      isLoaded = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile?.username])

  return (
    <>
      <Seo pageTitle='Stocks' />
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <BackButton />
        <ContextMenu items={contextMenu} />
      </Box>

      <ResponsiveContainer>
        <TabList tabs={tabs} onSetTab={handleSelectTab} />
        {loading ? (
          <WarmupBox />
        ) : (
          <>
            {selectedTab === 'Stocks' && (
              <>
                <RequireClaim claimType={'rs'}>{authProfile && <StocksLayout userProfile={authProfile} />}</RequireClaim>
              </>
            )}
            {selectedTab === 'Futures' && <FuturesLayout />}
            {selectedTab === 'Events' && <EconCalendarLayout />}
            {selectedTab === 'Earnings' && <EarningsCalendarLayout />}
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
