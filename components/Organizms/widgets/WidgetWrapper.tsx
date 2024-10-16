import { Box, Paper } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import { ReactNode } from 'react'
import DelayedComponentRender from './DelayedComponentRender'

const WidgetWrapper = ({ id, delayMs, header, children }: { id: string; delayMs: number; header: string; children: ReactNode | JSX.Element[] }) => {
  return (
    <Box>
      <Paper elevation={3}>
        <CenteredHeader variant='h4' title={header} />
      </Paper>
      <DelayedComponentRender key={id} delayMs={delayMs}>
        {children}
      </DelayedComponentRender>
    </Box>
  )
}
export default WidgetWrapper
