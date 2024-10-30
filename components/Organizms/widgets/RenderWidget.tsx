import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { DashboardWidget } from '../dashboard/dashboardModel'
import WidgetWrapper from './WidgetWrapper'
import StockMarketGlance from '../stocks/StockMarketGlance'
import NewsLayout from '../news/NewsLayout'
import { Box } from '@mui/material'
import EconIndexWidget from './econ/EconIndexWidget'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'

type WidgetDimensions = {
  height: number
  width: number
}

const RenderWidget = ({ item, revalidateOnFocus = false }: { item: DashboardWidget; revalidateOnFocus?: boolean }) => {
  const dimension: WidgetDimensions = {
    height: 350,
    width: 280,
  }
  switch (item.size) {
    case 'md':
      dimension.height = 400
      dimension.width = 550
      break
    case 'lg':
      dimension.height = 900
      dimension.width = 850
      break
  }

  return (
    <Box minWidth={dimension.width} sx={{ border: `solid ${CasinoBlueTransparent} 1px` }} borderRadius={1}>
      {item.id === 'news' && (
        <Box width={dimension.width}>
          <WidgetWrapper id={item.id} header={'News'} delayMs={item.waitToRenderMs}>
            <NewsLayout componentLoader revalidateOnFocus={revalidateOnFocus} />
          </WidgetWrapper>
        </Box>
      )}
      {item.id === 'stock-market-sentiment' && (
        <Box width={dimension.width}>
          <WidgetWrapper id={item.id} header={item.title} delayMs={item.waitToRenderMs}>
            <StockMarketGlance showTitle={false} componentLoader revalidateOnFocus={revalidateOnFocus} width={dimension.width} />
          </WidgetWrapper>
        </Box>
      )}
      <Box>
        {item.id === 'snp' && (
          <Box>
            <WidgetWrapper id={item.id} header={item.title} delayMs={item.waitToRenderMs}>
              <EconIndexWidget itemId={14} symbol={item.title} width={dimension.width} height={dimension.height} />
            </WidgetWrapper>
          </Box>
        )}
        {item.id === 'dowjones' && (
          <Box>
            <WidgetWrapper id={item.id} header={item.title} delayMs={item.waitToRenderMs}>
              <EconIndexWidget itemId={15} symbol={item.title} width={dimension.width} height={dimension.height} />
            </WidgetWrapper>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default RenderWidget
