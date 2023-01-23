import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import * as React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Delete, DragIndicator } from '@mui/icons-material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import StockListMenu from 'components/Molecules/Menus/StockListItemMenu'

export type DraggableListItemProps = {
  item: StockQuote
  index: number
  onRemoveItem: (id: string) => void
}

const DraggableListItem = ({ item, index, onRemoveItem }: DraggableListItemProps) => {
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
            <ListItemAvatar>
              <DragIndicator />
            </ListItemAvatar>
            <ListItemText primary={item.Symbol} secondary={item.Company} />
            <Stack alignItems={'flex-end'} flexGrow={1} pr={2}>
              <IconButton
                onClick={() => {
                  handleRemoveItem(item.Symbol)
                }}
              >
                <Delete color='error' fontSize='small' />
              </IconButton>
              {/* <StockListMenu id={item.Symbol} onRemoveItem={handleRemoveItem} /> */}
            </Stack>
          </ListItem>

          <HorizontalDivider />
        </>
      )}
    </Draggable>
  )
}

export default DraggableListItem
