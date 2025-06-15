import { DashboardWidget } from '../dashboard/dashboardModel'
import WidgetWrapper from './WidgetWrapper'
import NewsLayout from '../news/NewsLayout'
import { Box } from '@mui/material'
import EconIndexWidget from './econ/EconIndexWidget'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import EconWidget from './econ/EconWidget'
import EarningsCalendarWidget from './stocks/earnings/EarningsCalendarWidget'
import WidgetFooter from './WidgetFooter'
import StockMarketGlanceWidget from './stocks/sentiment/StockMarketGlanceWidget'
import FeaturedRecipesWidget from './recipes/FeaturedRecipesWidget'
import { useViewPortSize } from 'hooks/ui/useViewportSize'
import NewsLayoutWrapper from '../news/NewsLayoutWrapper'

export type WidgetDimensions = {
  height: number
  width: number
}

const RenderWidget = ({ item, revalidateOnFocus = false }: { item: DashboardWidget; revalidateOnFocus?: boolean }) => {
  const { viewPortSize: size } = useViewPortSize()

  const dimension: WidgetDimensions = {
    height: 450,
    width: size === 'xs' ? 370 : 280,
  }

  if (size !== 'xs') {
    switch (item.size) {
      case 'md':
        dimension.width = size === 'sm' ? 300 : 520
        break
      case 'lg':
        dimension.width = size === 'sm' ? 600 : 808
        break
    }
  }

  return (
    <Box minWidth={dimension.width} sx={{ border: `solid ${CasinoBlueTransparent} 1px` }} borderRadius={1}>
      {item.id === 'news' && (
        <Box width={dimension.width}>
          <WidgetWrapper item={item}>
            <NewsLayoutWrapper suspendLoader revalidateOnFocus={revalidateOnFocus} />
          </WidgetWrapper>
        </Box>
      )}
      {item.id === 'stock-market-sentiment' && (
        <Box width={dimension.width}>
          <WidgetWrapper item={item}>
            <StockMarketGlanceWidget showTitle={false} revalidateOnFocus={revalidateOnFocus} width={dimension.width} height={dimension.height} />
            <WidgetFooter detailsUrl='/csr/stocks/sentiment' />
          </WidgetWrapper>
        </Box>
      )}
      <Box>
        {item.category === 'econ-ind-index' && (
          <Box>
            <WidgetWrapper item={item}>
              <EconIndexWidget itemId={Number(item.internalId)} symbol={item.title} width={dimension.width} height={dimension.height} />
              <WidgetFooter detailsUrl={`/csr/economic-indicators/${item.internalId}`} />
            </WidgetWrapper>
          </Box>
        )}
        {item.category === 'econ-ind' && (
          <Box>
            <WidgetWrapper item={item}>
              <EconWidget itemId={Number(item.internalId)} symbol={item.title} width={dimension.width} height={dimension.height} />
              <WidgetFooter detailsUrl={`/csr/economic-indicators/${item.internalId}`} />
            </WidgetWrapper>
          </Box>
        )}
        {item.id === 'earnings-calendar' && (
          <Box>
            <WidgetWrapper item={item}>
              <EarningsCalendarWidget width={dimension.width} height={dimension.height} size={item.size} />
              <WidgetFooter detailsUrl={'/csr/stocks/earnings-calendar'} />
            </WidgetWrapper>
          </Box>
        )}
        {item.id === 'featured-recipes' && (
          <Box>
            <WidgetWrapper item={item}>
              <FeaturedRecipesWidget width={dimension.width} height={dimension.height} size={item.size} />
              <WidgetFooter detailsUrl={'/ssg/recipes'} />
            </WidgetWrapper>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default RenderWidget
