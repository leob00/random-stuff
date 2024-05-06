import React from 'react'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import StockMarketGlance from '../stocks/StockMarketGlance'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import NewsLayout from '../news/NewsLayout'

const UserDashboardLayout = ({ ticket }: { ticket: AmplifyUser | null }) => {
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
