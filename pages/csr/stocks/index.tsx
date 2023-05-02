import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import Seo from 'components/Organizms/Seo'
import FuturesLayout from 'components/Organizms/stocks/FuturesLayout'
import StockSearchLayout from 'components/Organizms/stocks/StockSearchLayout'
import { useUserController } from 'hooks/userController'
import React from 'react'

const Page = () => {
  const ticket = useUserController().ticket
  const backUrl = ticket ? '/protected/csr/dashboard' : ''
  const tabs: TabInfo[] = [{ title: 'Stocks', selected: true }, { title: 'Futures' }]
  const [selectedTab, setSelectedTab] = React.useState('Stocks')

  const handleSelectTab = (title: string) => {
    setSelectedTab(title)
  }

  return (
    <>
      <Seo pageTitle='Stocks' />
      <ResponsiveContainer>
        <TabButtonList tabs={tabs} onSelected={handleSelectTab} />
        {/* <PageHeader text={'Stocks'} backButtonRoute={backUrl} /> */}
        {selectedTab === 'Stocks' && <StockSearchLayout />}
        {selectedTab === 'Futures' && <FuturesLayout />}
      </ResponsiveContainer>
    </>
  )
}

export default Page
