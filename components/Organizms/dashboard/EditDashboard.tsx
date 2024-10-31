import { Box, ListItem, ListItemText } from '@mui/material'
import { type DashboardWidget } from './dashboardModel'
import DraggableList from './DraggableList'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import OnOffSwitch from 'components/Atoms/Inputs/OnOffSwitch'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'

const EditDashboard = () => {
  const { dashboardWidgets, saveDashboardWidgets } = useLocalStore()
  const allAvailableWidgets = [...allWidgets]

  let visibleWidgets = dashboardWidgets.filter((m) => m.display)
  let hiddenWidgets: DashboardWidget[] = []
  allAvailableWidgets.forEach((all) => {
    if (!visibleWidgets.find((m) => m.id === all.id)) {
      hiddenWidgets.push({ ...all, display: false })
    }
  })
  if (hiddenWidgets.length === 0) {
    hiddenWidgets = dashboardWidgets.filter((m) => !m.display)
  }

  const handlePushChanges = (items: DashboardWidget[]) => {
    const newVisibleWidgets = items.filter((m) => m.display)
    const newHiddenWidgets: DashboardWidget[] = []
    allAvailableWidgets.forEach((all) => {
      if (!newVisibleWidgets.find((m) => m.id === all.id)) {
        newHiddenWidgets.push({ ...all, display: false })
      }
    })

    newVisibleWidgets.forEach((m, index) => {
      m.waitToRenderMs = (index + 1) * 750
    })
    newHiddenWidgets.forEach((m) => {
      m.waitToRenderMs = 0
    })
    const newItems = [...newVisibleWidgets, ...newHiddenWidgets]
    saveDashboardWidgets(newItems)
  }

  const handleUpdateShowHide = (item: DashboardWidget, display: boolean) => {
    const newItems = [...dashboardWidgets]
    const idx = newItems.findIndex((m) => m.id === item.id)
    if (idx > -1) {
      newItems[idx].display = display
    } else {
      newItems.push({ ...item, display: display })
    }
    handlePushChanges(newItems)
  }

  return (
    <Box>
      <CenteredTitle title='visible widgets' />
      <DraggableList items={visibleWidgets} onPushChanges={handlePushChanges} />
      <Box>
        {hiddenWidgets.length > 0 && <CenteredTitle title='available widgets' />}
        {hiddenWidgets.map((item, index) => (
          <ListItem id={item.id} key={item.id}>
            <ListItemText primary={`${item.title}`} secondary={` `} sx={{ mt: -0.5 }} />
            <Box>
              <OnOffSwitch
                label='show'
                isChecked={item.display}
                onChanged={(checked) => {
                  handleUpdateShowHide(item, checked)
                }}
              />
            </Box>
          </ListItem>
        ))}
      </Box>
    </Box>
  )
}

export const allWidgets: DashboardWidget[] = [
  {
    id: 'stock-market-sentiment',
    waitToRenderMs: 750,
    title: 'Market Sentiment',
    display: true,
    size: 'sm',
    allowSizeChange: true,
  },
  {
    id: 'news',
    waitToRenderMs: 1500,
    title: 'News',
    display: false,
    size: 'sm',
    allowSizeChange: true,
  },
  {
    id: 'snp',
    waitToRenderMs: 2000,
    title: 'S&P 500',
    display: false,
    size: 'sm',
    allowSizeChange: true,
  },
  {
    id: 'dowjones',
    waitToRenderMs: 2500,
    title: 'Dow Jones',
    display: false,
    size: 'sm',
    allowSizeChange: true,
  },
]

export default EditDashboard
