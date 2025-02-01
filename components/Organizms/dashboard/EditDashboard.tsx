import { Box, ListItem, ListItemText } from '@mui/material'
import { type DashboardWidget } from './dashboardModel'
import DraggableWidgetList from './DraggableWidgetList'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import OnOffSwitch from 'components/Atoms/Inputs/OnOffSwitch'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { sortArray } from 'lib/util/collections'
import FadeIn from 'components/Atoms/Animations/FadeIn'

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
  hiddenWidgets = sortArray(hiddenWidgets, ['title'], ['asc'])

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
      <CenteredTitle title='my widgets' />
      <DraggableWidgetList items={visibleWidgets} onPushChanges={handlePushChanges} />
      <Box pt={4} pb={8}>
        <>
          {hiddenWidgets.length > 0 && (
            <Box py={2}>
              <CenteredTitle title='more widgets' />
            </Box>
          )}
          {hiddenWidgets.map((item, index) => (
            <Box key={item.id}>
              <FadeIn>
                <ListItem id={item.id}>
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
              </FadeIn>
              <HorizontalDivider />
            </Box>
          ))}
        </>
      </Box>
    </Box>
  )
}

export const allWidgets: DashboardWidget[] = [
  {
    id: 'stock-market-sentiment',
    category: 'stock-market-sentiment',
    waitToRenderMs: 750,
    title: 'Market Sentiment',
    display: true,
    size: 'sm',
    allowSizeChange: true,
  },
  {
    id: 'news',
    category: 'news',
    waitToRenderMs: 1500,
    title: 'News',
    display: false,
    size: 'sm',
    allowSizeChange: true,
  },
  {
    id: 'dowjones',
    category: 'econ-ind-index',
    waitToRenderMs: 2500,
    title: 'Dow Jones',
    display: false,
    size: 'sm',
    allowSizeChange: true,
    internalId: '14',
  },
  {
    id: 'snp',
    category: 'econ-ind-index',
    waitToRenderMs: 2000,
    title: 'S&P 500',
    display: false,
    size: 'sm',
    allowSizeChange: true,
    internalId: '15',
  },
  {
    id: 'unemployment-rate',
    category: 'econ-ind',
    waitToRenderMs: 2000,
    title: 'Unemployment Rate',
    display: false,
    size: 'sm',
    allowSizeChange: true,
    internalId: '1',
  },
  {
    id: 'mortgage-rate-30',
    category: 'econ-ind',
    waitToRenderMs: 3500,
    title: '30-Year Fixed Mortgage',
    display: false,
    size: 'sm',
    allowSizeChange: true,
    internalId: '23',
  },
  {
    id: 'mortgage-rate-15',
    category: 'econ-ind',
    waitToRenderMs: 3500,
    title: '15-Year Fixed Mortgage',
    display: false,
    size: 'sm',
    allowSizeChange: true,
    internalId: '24',
  },
  {
    id: 'earnings-calendar',
    category: 'earnings',
    waitToRenderMs: 4500,
    title: 'Earnings Calendar',
    display: false,
    size: 'sm',
    allowSizeChange: true,
  },
]

export default EditDashboard
