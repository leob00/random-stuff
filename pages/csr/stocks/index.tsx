import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import Seo from 'components/Organizms/Seo'
import EconCalendarLayout from 'components/Organizms/stocks/EconCalendarLayout'
import FuturesLayout from 'components/Organizms/stocks/FuturesLayout'
import StocksLayout from 'components/Organizms/stocks/StocksLayout'
import { useUserController } from 'hooks/userController'
import React from 'react'

const Page = () => {
  const tabs: TabInfo[] = [{ title: 'Stocks', selected: true }, { title: 'Futures' }, { title: 'Econ Events' }]
  const [selectedTab, setSelectedTab] = React.useState('Stocks')
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)

  const handleSelectTab = (title: string) => {
    setSelectedTab(title)
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
      <ResponsiveContainer>
        <TabButtonList tabs={tabs} onSelected={handleSelectTab} />
        {loading ? (
          <WarmupBox />
        ) : (
          <>
            <Box sx={{ display: selectedTab !== 'Stocks' ? 'none' : 'unset' }}>
              {userController.authProfile !== null && !loading ? <StocksLayout userProfile={userController.authProfile} /> : <PleaseLogin message={'In order to track stocks, you need to register and login.'} />}
            </Box>
            {selectedTab === 'Futures' && <FuturesLayout />}
            {selectedTab === 'Econ Events' && <EconCalendarLayout />}
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
