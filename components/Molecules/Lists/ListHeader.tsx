import { Box, Card, CardHeader, Stack, Typography, styled, useTheme } from '@mui/material'
import React from 'react'
import ContextMenu, { ContextMenuItem } from '../Menus/ContextMenu'
import ContextMenuAdd from '../Menus/ContextMenuAdd'
import ContextMenuDelete from '../Menus/ContextMenuDelete'
import ContextMenuEdit from '../Menus/ContextMenuEdit'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { CasinoBlue, VeryLightBlue } from 'components/themes/mainTheme'
import ListHeaderStack from './ListHeaderStack'

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
  const theme = useTheme()
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

  const StyledBox = styled(Stack)`
    & .MuiStack-root {
      //border-radius: 20px;
      background-color: transparent;
      //border: solid 1px ${theme.palette.primary.main};
    }
    & .MuiCardHeader-root {
      //background-color: red;
      //border-radius: 28px;
    }
    &:hover {
      border: solid 1px ${theme.palette.primary.main};
      border-radius: 6px;
      padding: 1px;
      //elevation: 0px;
    }
  `

  const ListHeaderContent = () => {
    return (
      <>
        {!disabled ? (
          <StyledBox>
            <ListHeaderStack
              contextMenu={contextMenu}
              item={item}
              text={text}
              disabled={disabled}
              elevation={elevation}
              onClicked={onClicked}
              showContextMenu={showContextMenu}
              underline={underline}
            />
          </StyledBox>
        ) : (
          <>
            <ListHeaderStack
              contextMenu={contextMenu}
              item={item}
              text={text}
              disabled={disabled}
              elevation={elevation}
              onClicked={onClicked}
              showContextMenu={showContextMenu}
              underline={underline}
            />
          </>
        )}
      </>
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
