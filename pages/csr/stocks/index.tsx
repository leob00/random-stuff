import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import Seo from 'components/Organizms/Seo'
import EconCalendarLayout from 'components/Organizms/stocks/EconCalendarLayout'
import FuturesLayout from 'components/Organizms/stocks/FuturesLayout'
import StockSearchLayout from 'components/Organizms/stocks/StockSearchLayout'
import { useUserController } from 'hooks/userController'
import { isLoggedIn } from 'lib/auth'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import React from 'react'

const getDbKey = (username: string) => {
  const key = `user-stock_list[${username}]`
  return encodeURIComponent(weakEncrypt(key))
}

const Page = () => {
  const ticket = useUserController().ticket
  const backUrl = ticket ? '/protected/csr/dashboard' : ''
  const tabs: TabInfo[] = [{ title: 'Stocks', selected: true }, { title: 'Futures' }, { title: 'Econ Events' }]
  const [selectedTab, setSelectedTab] = React.useState('Stocks')
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [apiUrl, setApiUrl] = React.useState('')

  const handleSelectTab = (title: string) => {
    setSelectedTab(title)
  }

  React.useEffect(() => {
    const fn = async () => {
      if (!userController.authProfile) {
        const p = await userController.fetchProfilePassive(900)
        if (!p) {
          console.log('unable to load profile')
        } else {
          const stockApiUrl = `/api/edgeGetRandomStuff?enc=${getDbKey(p.username)}`
          setApiUrl(stockApiUrl)
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
            {selectedTab === 'Stocks' && (
              <>
                {userController.authProfile && apiUrl.length > 0 ? (
                  <StockSearchLayout />
                ) : (
                  <PleaseLogin message={'In order to track stocks, you need to register and login.'} />
                )}
              </>
            )}
            {selectedTab === 'Futures' && <FuturesLayout />}
            {selectedTab === 'Econ Events' && <EconCalendarLayout />}
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
