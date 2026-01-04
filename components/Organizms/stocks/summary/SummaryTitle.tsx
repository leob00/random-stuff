import { Box, Stack, Typography } from '@mui/material'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuRefresh from 'components/Molecules/Menus/ContextMenuRefresh'

const SummaryTitle = ({ title, onRefresh }: { title: string; onRefresh?: () => void }) => {
  const menu: ContextMenuItem[] = [
    {
      fn: () => onRefresh?.(),
      item: <ContextMenuRefresh />,
    },
  ]

  return (
    <Box pb={2}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box flexGrow={1}>
          <Typography textAlign={'center'} variant='h6'>
            {title}
          </Typography>
        </Box>
        {onRefresh && (
          <Box>
            <ContextMenu items={menu} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default SummaryTitle
