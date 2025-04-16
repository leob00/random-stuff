import { Box, Card, CardHeader, Stack, Typography } from '@mui/material'
import ContextMenu, { ContextMenuItem } from '../Menus/ContextMenu'

const ListHeaderStack = ({
  text,
  item,
  elevation,
  disabled,
  onClicked,
  contextMenu,
  showContextMenu,
  underline,
}: {
  text: string
  item: any
  elevation?: number
  disabled?: boolean
  onClicked?: (item: unknown) => void
  contextMenu: ContextMenuItem[]
  showContextMenu?: boolean
  underline?: boolean
}) => {
  return (
    <Stack direction={'row'} flexGrow={1}>
      <Box
        px={2}
        width={'100%'}
        sx={{ cursor: !disabled ? 'pointer' : 'unset' }}
        onClick={(e) => {
          onClicked?.(item)
        }}
      >
        <Typography textAlign={'left'} variant='h6' color='primary' sx={{ textDecoration: `${underline ? 'underline' : 'unset'}` }}>
          {text}
        </Typography>
      </Box>
      <Box>{showContextMenu && <ContextMenu items={contextMenu} />}</Box>
    </Stack>
  )
}

export default ListHeaderStack
