import { Box } from '@mui/material'
import { type DashboardWidget } from './dashboardModel'
import DraggableList from './DraggableList'

export const allWidgets: DashboardWidget[] = [
  {
    id: 'stock-market-sentiment',
    waitToRenderMs: 0,
    title: 'stock market sentiment',
  },
  {
    id: 'news',
    waitToRenderMs: 400,
    title: 'news',
  },
]

const EditDashboard = () => {
  const handlePushChanges = (items: DashboardWidget[]) => {}

  return (
    <Box>
      <DraggableList items={allWidgets} onPushChanges={handlePushChanges} />
    </Box>
  )
}

export default EditDashboard
