import React from 'react'
import StockMarketGlance from '../stocks/StockMarketGlance'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import NewsLayout from '../news/NewsLayout'

const UserDashboardLayout = () => {
  return (
    <>
      <ScrollableBox maxHeight={800}>
        <StockMarketGlance />
        <NewsLayout componentLoader />
      </ScrollableBox>
    </>
  )
}

export default UserDashboardLayout
