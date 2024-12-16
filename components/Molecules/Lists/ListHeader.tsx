import { Box, Card, CardHeader, Stack, Typography } from '@mui/material'
import React from 'react'
import ContextMenu, { ContextMenuItem } from '../Menus/ContextMenu'
import ContextMenuAdd from '../Menus/ContextMenuAdd'
import ContextMenuDelete from '../Menus/ContextMenuDelete'
import ContextMenuEdit from '../Menus/ContextMenuEdit'
import FadeIn from 'components/Atoms/Animations/FadeIn'

const ListHeader = ({
  text,
  item,
  onClicked,
  onEdit,
  onDelete,
  onAdd,
  addText = 'add',
  underline,
  disabled,
  elevation = 1,
  fadeIn = true,
}: {
  text: string
  item?: any
  onClicked?: (item: any) => void
  onEdit?: (item: any) => void
  onDelete?: (item: any) => void
  onAdd?: (item: any) => void
  addText?: string
  underline?: boolean
  disabled?: boolean
  elevation?: number
  fadeIn?: boolean
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

  const ListHeaderContent = () => {
    return (
      <Stack direction={'row'} flexGrow={1} alignItems={'center'}>
        <Card sx={{ width: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} elevation={elevation}>
          <CardHeader
            title={
              <>
                <Box
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
              </>
            }
          ></CardHeader>
        </Card>
        <Box>{showContextMenu && <ContextMenu items={contextMenu} />}</Box>
      </Stack>
    )
  }

  return (
    <Box>
      {fadeIn ? (
        <FadeIn>
          <ListHeaderContent />
        </FadeIn>
      ) : (
        <ListHeaderContent />
      )}
    </Box>
  )
}

export default ListHeader
