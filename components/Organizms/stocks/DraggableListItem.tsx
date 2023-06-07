import { ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material'
import { Draggable } from 'react-beautiful-dnd'
import DragIndicator from '@mui/icons-material/DragIndicator'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import { SelectableQuote } from './DraggableList'
import SingleItemMenu from './SingleItemMenu'
import { StockQuote } from 'lib/backend/api/models/zModels'

export type DraggableListItemProps = {
  item: SelectableQuote
  index: number
  onRemoveItem: (id: string) => void
  onCheckItem: (checked: boolean) => void
  onEdit: (item: StockQuote) => void
}

const DraggableListItem = ({ item, index, onRemoveItem, onCheckItem, onEdit }: DraggableListItemProps) => {
  const handleRemoveItem = (id: string) => {
    onRemoveItem(id)
  }

  return (
    <>
      <Draggable draggableId={item.Symbol} index={index} key={item.Symbol}>
        {(provided, snapshot) => (
          <>
            <ListItem
              id={item.Symbol}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              // className={snapshot.isDragging ? classes.draggingListItem : ''}
            >
              <SecondaryCheckbox onChanged={onCheckItem} checked={item.selected} />
              <ListItemAvatar>
                <DragIndicator />
              </ListItemAvatar>
              <ListItemText primary={`${item.Company} (${item.Symbol})`} secondary={`Group name: ${item.GroupName ?? ''}`} />
              <Stack alignItems={'flex-end'} flexGrow={1} pr={2}>
                <SingleItemMenu onEdelete={handleRemoveItem} quote={item} onEdit={onEdit} />
              </Stack>
            </ListItem>
            <HorizontalDivider />
          </>
        )}
      </Draggable>
    </>
  )
}

export default DraggableListItem
