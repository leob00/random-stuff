import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import { ReactNode } from 'react'
import DelayedComponentRender from './DelayedComponentRender'
import { DashboardWidget } from '../dashboard/dashboardModel'

const WidgetWrapper = ({ item, children }: { item: DashboardWidget; children: ReactNode | JSX.Element[] }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Box>
      <Box py={1}>
        <Typography variant={'h6'} sx={{ textAlign: 'center' }} fontWeight={500}>
          {item.title}
        </Typography>
      </Box>
      <DelayedComponentRender key={item.id} delayMs={item.waitToRenderMs}>
        {children}
      </DelayedComponentRender>
    </Box>
  )
}
export default WidgetWrapper
