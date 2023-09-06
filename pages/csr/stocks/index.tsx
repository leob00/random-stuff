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

const Page = () => {
  const router = useRouter()
  const tab = router.query['tab'] as string | undefined

  const tabs: TabInfo[] = [{ title: 'Stocks' }, { title: 'Futures' }, { title: 'Events' }, { title: 'Earnings' }]
  if (tab) {
    tabs[tabs.findIndex((m) => m.title === tab)].selected = true
  } else {
    tabs[0].selected = true
  }

  const [selectedTab, setSelectedTab] = React.useState(tab ?? 'Stocks')
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)

  const handleSelectTab = (tab: TabInfo) => {
    setSelectedTab(tab.title)
  }

  React.useEffect(() => {
    let isLoaded = false
    if (!isLoaded) {
      const fn = async () => {
        if (userController.authProfile === null || !userController.authProfile) {
          const p = await userController.fetchProfilePassive(900)
          if (!p) {
            console.log('unable to load profile')
          }
          userController.setProfile(p)
        }
        setLoading(false)
      }
      fn()
    }
    return () => {
      isLoaded = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController.authProfile?.username])

  return (
    <>
      <Seo pageTitle='Stocks' />
      <BackButton />

      <ResponsiveContainer>
        <TabList tabs={tabs} onSetTab={handleSelectTab} />
        {loading ? (
          <WarmupBox />
        ) : (
          <>
            {selectedTab === 'Stocks' && (
              <>
                {userController.authProfile !== null ? (
                  <RequireClaim claimType={'rs'}>
                    <StocksLayout userProfile={userController.authProfile} />
                  </RequireClaim>
                ) : (
                  <></>
                )}
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
