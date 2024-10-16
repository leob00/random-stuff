import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { DashboardWidget } from '../dashboard/dashboardModel'
import WidgetWrapper from './WidgetWrapper'
import StockMarketGlance from '../stocks/StockMarketGlance'
import NewsLayout from '../news/NewsLayout'

const RenderWidget = ({ item, revalidateOnFocus = false }: { item: DashboardWidget; revalidateOnFocus?: boolean }) => {
  return (
    <>
      <>
        {item.id === 'news' && (
          <WidgetWrapper id={item.id} header={'News'} delayMs={item.waitToRenderMs}>
            <ScrollableBox maxHeight={590}>
              <NewsLayout componentLoader revalidateOnFocus={revalidateOnFocus} />
            </ScrollableBox>
          </WidgetWrapper>
        )}
      </>
      {item.id === 'stock-market-sentiment' && (
        <WidgetWrapper id={item.id} header={'Stock Sentiment'} delayMs={item.waitToRenderMs}>
          <ScrollableBox maxHeight={590}>
            <StockMarketGlance showTitle={false} componentLoader revalidateOnFocus={revalidateOnFocus} />
          </ScrollableBox>
        </WidgetWrapper>
      )}
    </>
  )
}

export default RenderWidget
