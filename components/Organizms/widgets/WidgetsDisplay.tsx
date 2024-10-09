import React, { useEffect } from 'react'
import { DashboardWidget } from '../dashboard/dashboardModel'
import StockMarketGlance from '../stocks/StockMarketGlance'
import DelayedComponentRender from './DelayedComponentRender'
import NewsLayout from '../news/NewsLayout'

const WidgetsDisplay = ({ widgets }: { widgets: DashboardWidget[] }) => {
  const renderWidget = (item: DashboardWidget) => {
    switch (item.id) {
      case 'stock-market-sentiment':
        return (
          <DelayedComponentRender key={item.id} delayMs={item.waitToRenderMs}>
            <StockMarketGlance />
          </DelayedComponentRender>
        )
      case 'news':
        return (
          <DelayedComponentRender key={item.id} delayMs={item.waitToRenderMs}>
            <NewsLayout />
          </DelayedComponentRender>
        )
    }
    return <></>
  }

  return (
    <>
      {widgets.map((item) => (
        <React.Fragment key={item.id}>{renderWidget(item)}</React.Fragment>
      ))}
    </>
  )
}

export default WidgetsDisplay
