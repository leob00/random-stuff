import { Box, Typography, useTheme } from '@mui/material'
import { ReactNode } from 'react'
import DelayedComponentRender from './DelayedComponentRender'
import { DashboardWidget } from '../dashboard/dashboardModel'
import FadeIn from 'components/Atoms/Animations/FadeIn'

const WidgetWrapper = ({ item, children }: { item: DashboardWidget; children: ReactNode | JSX.Element[] }) => {
  const theme = useTheme()
  return (
    <Box>
      <Box py={1}>
        <Typography variant={'h6'} sx={{ textAlign: 'center' }} fontWeight={500}>
          {item.title}
        </Typography>
      </Box>
      <DelayedComponentRender key={item.id} delayMs={item.waitToRenderMs}>
        <FadeIn duration={2}>{children}</FadeIn>
      </DelayedComponentRender>
    </Box>
  )
}
export default WidgetWrapper
