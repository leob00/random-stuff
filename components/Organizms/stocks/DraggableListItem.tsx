import { Avatar, ListItem, ListItemAvatar, ListItemText, makeStyles } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import * as React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { DragIndicator } from '@mui/icons-material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

export type DraggableListItemProps = {
  item: StockQuote
  index: number
}

const DraggableListItem = ({ item, index }: DraggableListItemProps) => {
  //const classes = useStyles()
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
          </ListItem>
          <HorizontalDivider />
        </>
      )}
    </Draggable>
  )
}

export default DraggableListItem
