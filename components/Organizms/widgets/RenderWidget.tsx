import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { DashboardWidget } from '../dashboard/dashboardModel'
import WidgetWrapper from './WidgetWrapper'
import StockMarketGlance from '../stocks/StockMarketGlance'
import NewsLayout from '../news/NewsLayout'
import { Box } from '@mui/material'

const RenderWidget = ({ item, revalidateOnFocus = false }: { item: DashboardWidget; revalidateOnFocus?: boolean }) => {
  return (
    <>
      {item.id === 'news' && (
        <Box minWidth={{ xs: 300, sm: 600, md: 800 }}>
          <WidgetWrapper id={item.id} header={'News'} delayMs={item.waitToRenderMs}>
            <NewsLayout componentLoader revalidateOnFocus={revalidateOnFocus} />
          </WidgetWrapper>
        </Box>
      )}
      {item.id === 'stock-market-sentiment' && (
        <Box minWidth={300}>
          <WidgetWrapper id={item.id} header={'Stock Sentiment'} delayMs={item.waitToRenderMs}>
            <ScrollableBox maxHeight={1000}>
              <StockMarketGlance showTitle={false} componentLoader revalidateOnFocus={revalidateOnFocus} />
            </ScrollableBox>
          </WidgetWrapper>
        </Box>
      )}
    </>
  )
}

export default RenderWidget
