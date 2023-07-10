import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import Seo from 'components/Organizms/Seo'
import EconCalendarLayout from 'components/Organizms/stocks/EconCalendarLayout'
import FuturesLayout from 'components/Organizms/stocks/FuturesLayout'
import StockSearchLayout from 'components/Organizms/stocks/StockSearchLayout'
import StockSearchLayoutUseSWR from 'components/Organizms/stocks/StockSearchLayoutUseSWR'
import { useUserController } from 'hooks/userController'
import { isLoggedIn } from 'lib/auth'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { get } from 'lib/backend/api/fetchFunctions'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import React from 'react'
import useSWR, { Fetcher, mutate } from 'swr'

const Page = () => {
  const ticket = useUserController().ticket
  //const backUrl = ticket ? '/protected/csr/dashboard' : ''
  const tabs: TabInfo[] = [{ title: 'Stocks', selected: true }, { title: 'Futures' }, { title: 'Econ Events' }]
  const [selectedTab, setSelectedTab] = React.useState('Stocks')
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  // console.log(profileApiUrl)
  const fetchProfile = async (url: string, token: string) => {
    // const p = userController.fetchProfilePassive(900)
    console.log('token: ', token)
    const result = (await get(url, { enc: token })) as UserProfile | null
    console.log(result)
    return result
  }
  // const { data: token } = useSWR(['/api/edgeGetRandomStuff', profileKey], ([url, token]) => fetchProfile(url, token))
  // const fetcher: Fetcher<UserProfile> = (url: string) => fetchProfile(url)
  //const { data, isLoading, isValidating } = useSWR(profileApiUrl, fetcher)
  //console.log(data)

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
              {userController.authProfile !== null && !loading ? (
                <StockSearchLayoutUseSWR userProfile={userController.authProfile} />
              ) : (
                <PleaseLogin message={'In order to track stocks, you need to register and login.'} />
              )}
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
