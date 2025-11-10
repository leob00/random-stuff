import { Box } from '@mui/material'
import { ContextMenuItem } from '../Menus/ContextMenu'
import ContextMenuAdd from '../Menus/ContextMenuAdd'
import ContextMenuDelete from '../Menus/ContextMenuDelete'
import ContextMenuEdit from '../Menus/ContextMenuEdit'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import ListHeaderStack from './ListHeaderStack'
import HoverEffect from './HoverEffect'

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
  fadeIn = true,
  selected,
  outlined,
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
  fadeIn?: boolean
  selected?: boolean
  outlined?: boolean
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
      <>
        {!disabled ? (
          <HoverEffect>
            <ListHeaderStack
              contextMenu={contextMenu}
              item={item}
              text={text}
              disabled={disabled}
              onClicked={onClicked}
              showContextMenu={showContextMenu}
              underline={underline}
              selected={selected}
              outlined={outlined}
            />
          </HoverEffect>
        ) : (
          <>
            <ListHeaderStack
              contextMenu={contextMenu}
              item={item}
              text={text}
              disabled={disabled}
              onClicked={onClicked}
              showContextMenu={showContextMenu}
              underline={underline}
              selected={selected}
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
