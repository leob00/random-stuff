import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { DashboardWidget } from '../dashboard/dashboardModel'
import WidgetWrapper from './WidgetWrapper'
import StockMarketGlance from '../stocks/StockMarketGlance'
import NewsLayout from '../news/NewsLayout'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import EconIndexWidget from './econ/EconIndexWidget'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import EconWidget from './econ/EconWidget'
import EarningsCalendarWidget from './stocks/earnings/EarningsCalendarWidget'

export type WidgetDimensions = {
  height: number
  width: number
}

const RenderWidget = ({ item, revalidateOnFocus = false }: { item: DashboardWidget; revalidateOnFocus?: boolean }) => {
  const theme = useTheme()
  const isXSmallDevice = useMediaQuery(theme.breakpoints.down('sm'))
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('md'))
  const dimension: WidgetDimensions = {
    height: 400,
    width: isXSmallDevice ? 370 : 280,
  }
  if (!isXSmallDevice) {
    switch (item.size) {
      case 'md':
        dimension.width = isSmallDevice ? 300 : 520
        break
      case 'lg':
        dimension.width = isSmallDevice ? 600 : 1080
        break
    }
  }

  return (
    <Box minWidth={dimension.width} sx={{ border: `solid ${CasinoBlueTransparent} 1px` }} borderRadius={1}>
      {item.id === 'news' && (
        <Box width={dimension.width}>
          <WidgetWrapper item={item}>
            <NewsLayout suspendLoader revalidateOnFocus={revalidateOnFocus} />
          </WidgetWrapper>
        </Box>
      )}
      {item.id === 'stock-market-sentiment' && (
        <Box width={dimension.width}>
          <WidgetWrapper item={item}>
            {item.size === 'sm' ? (
              <ScrollableBox maxHeight={dimension.height}>
                <StockMarketGlance showTitle={false} componentLoader revalidateOnFocus={revalidateOnFocus} width={dimension.width} />
              </ScrollableBox>
            ) : (
              <>
                <StockMarketGlance showTitle={false} componentLoader revalidateOnFocus={revalidateOnFocus} width={dimension.width} />
              </>
            )}
          </WidgetWrapper>
        </Box>
      )}
      <Box>
        {item.category === 'econ-ind-index' && (
          <Box>
            <WidgetWrapper item={item}>
              <EconIndexWidget itemId={Number(item.internalId)} symbol={item.title} width={dimension.width} height={dimension.height} />
            </WidgetWrapper>
          </Box>
        )}
        {item.category === 'econ-ind' && (
          <Box>
            <WidgetWrapper item={item}>
              <EconWidget itemId={Number(item.internalId)} symbol={item.title} width={dimension.width} height={dimension.height} />
            </WidgetWrapper>
          </Box>
        )}
        {item.id === 'earnings-calendar' && (
          <Box>
            <WidgetWrapper item={item}>
              <EarningsCalendarWidget width={dimension.width} height={dimension.height} size={item.size} />
            </WidgetWrapper>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default RenderWidget
