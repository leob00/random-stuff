import { Box } from '@mui/material'
import { type DashboardWidget } from './dashboardModel'
import DraggableList from './DraggableList'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import { useMemo } from 'react'

export const allWidgets: DashboardWidget[] = [
  {
    id: 'stock-market-sentiment',
    waitToRenderMs: 0,
    title: 'stock market sentiment',
    display: true,
  },
  {
    id: 'news',
    waitToRenderMs: 400,
    title: 'news',
    display: false,
  },
]

const EditDashboard = () => {
  const { dashboardWidgets, saveDashboardWidgets } = useLocalStore()
  const allAvailabe = [...allWidgets]

  const filtered = useMemo(() => {
    const filteredWidgets = [...dashboardWidgets]
    allAvailabe.forEach((m) => {
      if (!filteredWidgets.find((w) => w.id === m.id)) {
        filteredWidgets.push(m)
      }
    })
    return filteredWidgets
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardWidgets])

  const handlePushChanges = (items: DashboardWidget[]) => {
    const list = [...items]
    const visibleWidgets = list.filter((m) => m.display)
    const hiddenWidgets = list.filter((m) => !m.display)

    visibleWidgets.forEach((m, index) => {
      m.waitToRenderMs = index * 750
    })
    hiddenWidgets.forEach((m) => {
      m.waitToRenderMs = 0
    })
    const newItems = [...visibleWidgets, ...hiddenWidgets]
    saveDashboardWidgets(newItems)
  }

  return (
    <Box>
      <DraggableList items={filtered} onPushChanges={handlePushChanges} />
    </Box>
  )
}

export default EditDashboard
