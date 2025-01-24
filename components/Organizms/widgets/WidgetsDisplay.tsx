import { DashboardWidget } from '../dashboard/dashboardModel'
import { Box } from '@mui/material'
import RenderWidget from './RenderWidget'

const WidgetsDisplay = ({ widgets }: { widgets: DashboardWidget[] }) => {
  return (
    <Box>
      {widgets.length > 1 ? (
        <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} flexWrap={'wrap'} justifyContent={{ xs: 'center' }}>
          {widgets.map((item) => (
            <Box key={item.id} px={0.25} py={2} minHeight={450} display={'flex'}>
              <RenderWidget item={item} />
            </Box>
          ))}
        </Box>
      ) : (
        <>
          {widgets.length === 1 && (
            <Box display={'flex'} justifyContent={'center'}>
              <Box key={widgets[0].id} px={1} py={2}>
                <RenderWidget item={widgets[0]} />
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default WidgetsDisplay
