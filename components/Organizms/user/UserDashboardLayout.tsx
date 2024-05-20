import StockMarketGlance from '../stocks/StockMarketGlance'
import NewsLayout from '../news/NewsLayout'

const UserDashboardLayout = () => {
  return (
    <>
      <StockMarketGlance />
      <NewsLayout componentLoader />
    </>
  )
}

export default UserDashboardLayout
