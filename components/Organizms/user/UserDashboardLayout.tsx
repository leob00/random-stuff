import StockMarketGlance from '../stocks/StockMarketGlance'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'

const UserDashboardLayout = () => {
  const scroller = useScrollTop(0)

  return (
    <>
      <ScrollableBox maxHeight={520} scroller={scroller}>
        <StockMarketGlance />
      </ScrollableBox>
    </>
  )
}

export default UserDashboardLayout
