import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import WarmupBox from 'components/Atoms/WarmupBox'
import Seo from 'components/Organizms/Seo'
import EconCalendarLayout from 'components/Organizms/stocks/EconCalendarLayout'
import FuturesLayout from 'components/Organizms/stocks/FuturesLayout'
import StockSearchLayout from 'components/Organizms/stocks/StockSearchLayout'
import { useUserController } from 'hooks/userController'
import { isLoggedIn } from 'lib/auth'
import React from 'react'

const Page = () => {
  const ticket = useUserController().ticket
  const backUrl = ticket ? '/protected/csr/dashboard' : ''
  const tabs: TabInfo[] = [{ title: 'Stocks', selected: true }, { title: 'Futures' }, { title: 'Econ Events' }]
  const [selectedTab, setSelectedTab] = React.useState('Stocks')
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)

  const handleSelectTab = (title: string) => {
    setSelectedTab(title)
  }

  React.useEffect(() => {
    const fn = async () => {
      if (!userController.authProfile) {
        const p = await userController.fetchProfilePassive(300)
        if (!p) {
          console.log('unable to load profile')
        }
        userController.setProfile(p)
      }
      setLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController.ticket])

  return (
    <>
      <Seo pageTitle='Stocks' />
      <ResponsiveContainer>
        <TabButtonList tabs={tabs} onSelected={handleSelectTab} />
        {loading ? (
          <WarmupBox />
        ) : (
          <>
            {selectedTab === 'Stocks' && <StockSearchLayout />}
            {selectedTab === 'Futures' && <FuturesLayout />}
            {selectedTab === 'Econ Events' && <EconCalendarLayout />}
            {/* <Box sx={{ display: selectedTab === 'Stocks' ? 'unset' : 'none' }}>
              <StockSearchLayout />
            </Box>
            <Box sx={{ display: selectedTab === 'Futures' ? 'unset' : 'none' }}>
              <FuturesLayout />
            </Box>
            <Box sx={{ display: selectedTab === 'Econ Events' ? 'unset' : 'none' }}>
              <EconCalendarLayout />
            </Box> */}
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
