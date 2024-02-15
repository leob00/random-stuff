import { Paper, Stack, Typography, useTheme } from '@mui/material'
import { ChartBackground, DarkBlue } from 'components/themes/mainTheme'
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
  backgroundColor,
  elevation,
  underline,
}: {
  text: string
  item: any
  onClicked: (item: any) => void
  onEdit?: (item: any) => void
  onDelete?: (item: any) => void
  onAdd?: (item: any) => void
  addText?: string
  backgroundColor?: string
  elevation?: number
  underline?: boolean
}) => {
  const theme = useTheme()
  const showContextMenu = onEdit !== undefined || onDelete !== undefined || onAdd !== undefined
  const backColor = !backgroundColor ? (theme.palette.mode === 'dark' ? DarkBlue : 'unset') : backgroundColor ?? 'transparent'
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
    <Stack pt={1}>
      {elevation ? (
        <Paper elevation={elevation}>
          <Stack sx={{ backgroundColor: backColor }} direction={'row'} flexGrow={1} px={2} alignItems={'center'}>
            <Stack
              width={'100%'}
              sx={{ cursor: 'pointer' }}
              onClick={(e) => {
                onClicked(item)
              }}
            >
              <Typography textAlign={'left'} variant='h5' color='primary' sx={{ textDecoration: `${underline ? 'underline' : 'unset'}` }}>
                {text}
              </Typography>
            </Stack>
            <Stack>{showContextMenu && <ContextMenu items={contextMenu} />}</Stack>
          </Stack>
        </Paper>
      ) : (
        <Stack sx={{ backgroundColor: backColor }} direction={'row'} flexGrow={1} px={2} alignItems={'center'}>
          <Stack
            py={1}
            width={'100%'}
            sx={{ cursor: 'pointer' }}
            onClick={(e) => {
              onClicked(item)
            }}
          >
            <Typography textAlign={'left'} variant='h5' color='primary' sx={{ textDecoration: `${underline ? 'underline' : 'unset'}` }}>
              {text}
            </Typography>
          </Stack>
          <Stack>{showContextMenu && <ContextMenu items={contextMenu} />}</Stack>
        </Stack>
      )}
    </Stack>
  )
}

export default ListHeader
