import { Box, Typography } from '@mui/material'
import { ReactNode } from 'react'
import DelayedComponentRender from './DelayedComponentRender'
import { DashboardWidget } from '../dashboard/dashboardModel'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import React from 'react'

const WidgetWrapper = ({ item, children }: { item: DashboardWidget; children: ReactNode | React.JSX.Element[] }) => {
  return (
    <Box>
      <Box py={1}>
        <Typography variant={'h6'} sx={{ textAlign: 'center' }} fontWeight={500}>
          {item.title}
        </Typography>
        <HorizontalDivider />
      </Box>
      <DelayedComponentRender key={item.id} delayMs={item.waitToRenderMs}>
        <FadeIn>{children}</FadeIn>
      </DelayedComponentRender>
    </Box>
  )
}
export default WidgetWrapper
