import { Box, Card, CardHeader, Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import ContextMenu, { ContextMenuItem } from '../Menus/ContextMenu'
import ContextMenuAdd from '../Menus/ContextMenuAdd'
import ContextMenuDelete from '../Menus/ContextMenuDelete'
import ContextMenuEdit from '../Menus/ContextMenuEdit'

const ListHeader = ({
  text,
  item,
  onClicked,
  onEdit,
  onDelete,
  onAdd,
  addText = 'add',
  underline,
}: {
  text: string
  item: any
  onClicked: (item: any) => void
  onEdit?: (item: any) => void
  onDelete?: (item: any) => void
  onAdd?: (item: any) => void
  addText?: string
  underline?: boolean
}) => {
  const showContextMenu = onEdit !== undefined || onDelete !== undefined || onAdd !== undefined

  const contextMenu: ContextMenuItem[] = []
  if (onEdit) {
    contextMenu.push({
      item: <ContextMenuEdit />,
      fn: () => {
        onEdit?.(item)
      },
    })
  }
  if (onDelete) {
    contextMenu.push({
      item: <ContextMenuDelete />,
      fn: () => {
        onDelete?.(item)
      },
    })
  }
  if (onAdd) {
    contextMenu.push({
      item: <ContextMenuAdd text={addText} />,
      fn: () => {
        onAdd?.(item)
      },
    })
  }

  return (
    <Box>
      <Stack direction={'row'} flexGrow={1} alignItems={'center'}>
        <Card sx={{ width: '100%' }} elevation={1}>
          <CardHeader
            title={
              <>
                <Box
                  width={'100%'}
                  sx={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    onClicked(item)
                  }}
                >
                  <Typography textAlign={'left'} variant='h5' color='primary' sx={{ textDecoration: `${underline ? 'underline' : 'unset'}` }}>
                    {text}
                  </Typography>
                </Box>
              </>
            }
          ></CardHeader>
        </Card>
        <Box>{showContextMenu && <ContextMenu items={contextMenu} />}</Box>
      </Stack>
    </Box>
  )
}

export default ListHeader
