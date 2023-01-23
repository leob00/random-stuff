import * as React from 'react'
import DraggableListItem from './DraggableListItem'
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { StrictModeDroppable } from './StrictModeDroppable'

export type DraggableListProps = {
  items: StockQuote[]
  onDragEnd: OnDragEndResponder
}

const DraggableList = ({ items, onDragEnd }: DraggableListProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId='droppable-list'>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item, index) => (
              <DraggableListItem item={item} index={index} key={item.Symbol} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
}
export default DraggableList
