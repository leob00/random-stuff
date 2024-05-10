import React from 'react'
import StockMarketGlance from '../stocks/StockMarketGlance'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import NewsLayout from '../news/NewsLayout'

const UserDashboardLayout = () => {
  return (
    <>
      <ScrollableBox>
        <StockMarketGlance />
        <NewsLayout componentLoader />
      </ScrollableBox>
    </>
  )
}

export default UserDashboardLayout
