import { DashboardWidget } from '../dashboard/dashboardModel'
import { Box, Paper } from '@mui/material'
import RenderWidget from './RenderWidget'

const WidgetsDisplay = ({ widgets }: { widgets: DashboardWidget[] }) => {
  return (
    <>
      {widgets.length > 1 ? (
        <Box display={'flex'} justifyContent={'flex-start'} flexDirection={{ xs: 'column', sm: 'row' }}>
          {widgets.map((item) => (
            <Box key={item.id} px={1} minHeight={500}>
              <RenderWidget item={item} revalidateOnFocus />
            </Box>
          ))}
        </Box>
      ) : (
        <>
          {widgets.length === 1 && (
            <Box display={'flex'} justifyContent={'center'}>
              <Box key={widgets[0].id} px={1} minHeight={500}>
                <Box>
                  <RenderWidget item={widgets[0]} revalidateOnFocus />
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  )
}

export default WidgetsDisplay
