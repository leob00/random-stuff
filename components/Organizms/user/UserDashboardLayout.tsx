import React from 'react'
import CenteredNavigationButton from 'components/Atoms/Buttons/CenteredNavigationButton'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import StockMarketGlance from '../stocks/StockMarketGlance'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import NewsLayout from '../news/NewsLayout'

const UserDashboardLayout = ({ ticket }: { ticket: AmplifyUser | null }) => {
  return (
    <>
      <ScrollableBox>
        <CenteredNavigationButton route={'/csr/stocks'} text={'stocks'} showDivider={false} />
        <StockMarketGlance />
        <CenteredNavigationButton route={'/csr/news'} text={'news'} showDivider={false} />
        <NewsLayout />
      </ScrollableBox>
    </>
  )
}

export default UserDashboardLayout
