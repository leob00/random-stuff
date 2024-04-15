import { Box, Card, CardHeader, Paper, Stack, Typography, useTheme } from '@mui/material'
import { ChartBackground, DarkBlue } from 'components/themes/mainTheme'
import React from 'react'
import ContextMenu, { ContextMenuItem } from '../Menus/ContextMenu'
import ContextMenuAdd from '../Menus/ContextMenuAdd'
import ContextMenuDelete from '../Menus/ContextMenuDelete'
import ContextMenuEdit from '../Menus/ContextMenuEdit'
import GradientContainer from 'components/Atoms/Boxes/GradientContainer'

const ListHeader = ({
  text,
  item,
  onClicked,
  onEdit,
  onDelete,
  onAdd,
  addText = 'add',
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
  elevation?: number
  underline?: boolean
}) => {
  const theme = useTheme()
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
      <Box>
        {elevation ? (
          <Paper elevation={elevation}>
            <Stack direction={'row'} flexGrow={1} px={2} alignItems={'center'}>
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
          <Box py={1}>
            <Stack direction={'row'} flexGrow={1} px={2} alignItems={'center'}>
              <Card sx={{ width: '100%' }} elevation={10}>
                <CardHeader
                  title={
                    <>
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
                    </>
                  }
                ></CardHeader>
              </Card>

              <Stack>{showContextMenu && <ContextMenu items={contextMenu} />}</Stack>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ListHeader
