import { DashboardWidget } from '../dashboard/dashboardModel'
import { Box, Paper } from '@mui/material'
import RenderWidget from './RenderWidget'

const WidgetsDisplay = ({ widgets }: { widgets: DashboardWidget[] }) => {
  return (
    <>
      {widgets.length > 1 ? (
        <Box display={'flex'} justifyContent={'flex-start'} flexDirection={{ xs: 'column', sm: 'row' }}>
          {widgets.map((item) => (
            <Box key={item.id} px={1} minHeight={{ xs: 600, sm: 900 }}>
              <RenderWidget item={item} />
            </Box>
          ))}
        </Box>
      ) : (
        <>
          {widgets.length === 1 && (
            <Box display={'flex'} justifyContent={'center'}>
              <Box key={widgets[0].id} px={1} minHeight={900}>
                <RenderWidget item={widgets[0]} />
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  )
}

export default WidgetsDisplay
