import { IconButton, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import * as React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Delete, DragIndicator } from '@mui/icons-material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import { SelectableQuote } from './DraggableList'

export type DraggableListItemProps = {
  item: SelectableQuote
  index: number
  onRemoveItem: (id: string) => void
  onCheckItem: (checked: boolean) => void
}

const DraggableListItem = ({ item, index, onRemoveItem, onCheckItem }: DraggableListItemProps) => {
  const handleRemoveItem = (id: string) => {
    onRemoveItem(id)
  }

  return (
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
              <IconButton
                onClick={() => {
                  handleRemoveItem(item.Symbol)
                }}
              >
                <Delete color='error' fontSize='small' />
              </IconButton>
            </Stack>
          </ListItem>

          <HorizontalDivider />
        </>
      )}
    </Draggable>
  )
}

export default DraggableListItem
