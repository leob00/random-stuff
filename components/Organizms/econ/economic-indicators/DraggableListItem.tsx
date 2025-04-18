import { ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material'
import { Draggable } from 'react-beautiful-dnd'
import DragIndicator from '@mui/icons-material/DragIndicator'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'

export type DraggableListItemProps = {
  item: EconomicDataItem
  index: number
}

const DraggableListItem = ({ item, index }: DraggableListItemProps) => {
  return (
    <>
      <Draggable draggableId={String(item.InternalId)} index={index} key={String(item.InternalId)}>
        {(provided, snapshot) => (
          <>
            <ListItem id={String(item.InternalId)} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              <ListItemAvatar>
                <DragIndicator />
              </ListItemAvatar>
              <ListItemText primary={`${item.Title}`} secondary={''} />
            </ListItem>
            <HorizontalDivider />
          </>
        )}
      </Draggable>
    </>
  )
}

export default DraggableListItem
