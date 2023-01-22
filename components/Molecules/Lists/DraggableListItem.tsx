import { Avatar, ListItem, ListItemAvatar, ListItemText, makeStyles } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import * as React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import MenuIcon from '@mui/icons-material/Menu'

export type DraggableListItemProps = {
  item: StockQuote
  index: number
}

const DraggableListItem = ({ item, index }: DraggableListItemProps) => {
  //const classes = useStyles()
  return (
    <Draggable draggableId={item.Symbol} index={index} key={item.Symbol}>
      {(provided, snapshot) => (
        <ListItem
          id={item.Symbol}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // className={snapshot.isDragging ? classes.draggingListItem : ''}
        >
          <ListItemAvatar>
            <Avatar>
              <MenuIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.Symbol} secondary={item.Company} />
        </ListItem>
      )}
    </Draggable>
  )
}

export default DraggableListItem
