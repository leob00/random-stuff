import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import Seo from 'components/Organizms/Seo'
import EarningsCalendarLayout from 'components/Organizms/stocks/EarningsCalendarLayout'
import EconCalendarLayout from 'components/Organizms/stocks/EconCalendarLayout'
import FuturesLayout from 'components/Organizms/stocks/FuturesLayout'
import StockDetailsLayout from 'components/Organizms/stocks/StockDetailsLayout'
import StocksLayout from 'components/Organizms/stocks/StocksLayout'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { useRouter } from 'next/router'
import React from 'react'

const Page = () => {
  const tabs: TabInfo[] = [{ title: 'Stocks', selected: true }, { title: 'Futures' }, { title: 'Events' }, { title: 'Earnings' }]
  const [selectedTab, setSelectedTab] = React.useState('Stocks')
  const userController = useUserController()

  const [loading, setLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null)

  const router = useRouter()
  const id = router.query['id'] as string
  console.log('id', id)

  const handleSelectTab = (title: string) => {
    setSelectedTab(title)
  }

  React.useEffect(() => {
    let isLoaded = false
    if (!isLoaded) {
      const fn = async () => {
        if (!userController.authProfile) {
          const p = await userController.fetchProfilePassive(900)
          userController.setProfile(p)
          setUserProfile(p)
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
        {loading && <BackdropLoader />}
        <BackButton />
        <CenteredTitle title={`${id}`}></CenteredTitle>
        {id && <StockDetailsLayout userProfile={userProfile} symbol={id} />}
        {/* <TabButtonList tabs={tabs} onSelected={handleSelectTab} />
        {loading ? (
          <WarmupBox />
        ) : (
          <>
            {selectedTab === 'Stocks' && (
              <>
                {userController.authProfile !== null ? (
                  <StocksLayout userProfile={userController.authProfile} />
                ) : (
                  <PleaseLogin message={'In order to track stocks, you need to register and login.'} />
                )}
              </>
            )}

            {selectedTab === 'Futures' && <FuturesLayout />}
            {selectedTab === 'Events' && <EconCalendarLayout />}
            {selectedTab === 'Earnings' && <EarningsCalendarLayout />}
          </>
        )} */}
      </ResponsiveContainer>
    </>
  )
}

export default Page
