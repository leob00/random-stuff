import StockMarketGlance from '../stocks/StockMarketGlance'
import NewsLayout from '../news/NewsLayout'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { Box } from '@mui/material'

const UserDashboardLayout = () => {
  const scroller = useScrollTop(0)

  return (
    <>
      <ScrollableBox maxHeight={420} scroller={scroller}>
        <StockMarketGlance />
      </ScrollableBox>
      <Box minHeight={400}>
        <NewsLayout componentLoader />
      </Box>
    </>
  )
}

export default UserDashboardLayout
