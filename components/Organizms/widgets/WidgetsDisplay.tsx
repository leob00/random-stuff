import React, { useEffect } from 'react'
import { DashboardWidget } from '../dashboard/dashboardModel'
import StockMarketGlance from '../stocks/StockMarketGlance'
import DelayedComponentRender from './DelayedComponentRender'
import NewsLayout from '../news/NewsLayout'
import { Box, Paper, Stack, Typography } from '@mui/material'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { CasinoBlackTransparent, CasinoBlueTransparent, DarkModeBkg } from 'components/themes/mainTheme'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'

const WidgetsDisplay = ({ widgets }: { widgets: DashboardWidget[] }) => {
  const renderWidget = (item: DashboardWidget) => {
    switch (item.id) {
      case 'stock-market-sentiment':
        return (
          <>
            <Paper elevation={3}>
              <CenteredHeader variant='h4' title={'Stock Sentiment'} />
            </Paper>
            <DelayedComponentRender key={item.id} delayMs={item.waitToRenderMs}>
              <ScrollableBox maxHeight={600}>
                <StockMarketGlance showTitle={false} componentLoader />
              </ScrollableBox>
            </DelayedComponentRender>
          </>
        )
      case 'news':
        return (
          <Box>
            <Paper elevation={3}>
              <CenteredHeader variant='h4' title={'News'} />
            </Paper>
            <DelayedComponentRender key={item.id} delayMs={item.waitToRenderMs}>
              <NewsLayout allowSelectType={true} componentLoader revalidateOnFocus />
            </DelayedComponentRender>
          </Box>
        )
    }
  }

  return (
    <>
      {widgets.length > 1 ? (
        <Box display={'flex'} justifyContent={'flex-start'} flexDirection={{ xs: 'column', sm: 'row' }}>
          {widgets.map((item) => (
            <Box key={item.id} px={1}>
              <Paper>{renderWidget(item)}</Paper>
            </Box>
          ))}
        </Box>
      ) : (
        <Box display={'flex'} justifyContent={'center'}>
          {widgets.map((item) => (
            <Box key={item.id} px={1}>
              <Box>{renderWidget(item)}</Box>
            </Box>
          ))}
        </Box>
      )}
    </>
  )
}

export default WidgetsDisplay
