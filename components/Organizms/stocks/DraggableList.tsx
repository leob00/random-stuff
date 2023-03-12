import * as React from 'react'
import DraggableListItem from './DraggableListItem'
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { StrictModeDroppable } from './StrictModeDroppable'
import { Box } from '@mui/material'

export type DraggableListProps = {
  items: StockQuote[]
  onDragEnd: OnDragEndResponder
  onRemoveItem: (id: string) => void
}

const DraggableList = ({ items, onDragEnd, onRemoveItem }: DraggableListProps) => {
  const handleRemoveItem = (id: string) => {
    onRemoveItem(id)
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId='droppable-list'>
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item, index) => (
              <DraggableListItem
                item={item}
                index={index}
                key={item.Symbol}
                onRemoveItem={() => {
                  handleRemoveItem(item.Symbol)
                }}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
}
export default DraggableList
