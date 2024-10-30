import { DashboardWidget } from '../dashboard/dashboardModel'
import { Box } from '@mui/material'
import RenderWidget from './RenderWidget'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'

const WidgetsDisplay = ({ widgets }: { widgets: DashboardWidget[] }) => {
  return (
    <Box>
      {widgets.length > 1 ? (
        <Box display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} flexWrap={'wrap'} justifyItems={'flex-start'}>
          {widgets.map((item) => (
            <Box key={item.id} px={0.25} py={2} minHeight={450} display={'flex'} justifySelf={'flex-start'}>
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
