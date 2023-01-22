import * as React from 'react'
import DraggableListItem from './DraggableListItem'
import { DragDropContext, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import { StockQuote } from 'lib/backend/api/models/zModels'

export type DraggableListProps = {
  items: StockQuote[]
  onDragEnd: OnDragEndResponder
}

const DraggableList = React.memo(({ items, onDragEnd }: DraggableListProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable-list'>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item, index) => (
              <DraggableListItem item={item} index={index} key={item.Symbol} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
})

export default DraggableList
