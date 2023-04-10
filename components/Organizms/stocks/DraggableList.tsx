import * as React from 'react'
import DraggableListItem from './DraggableListItem'
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { StrictModeDroppable } from './StrictModeDroppable'
import { Box } from '@mui/material'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'

export type DraggableListProps = {
  items: StockQuote[]
  onDragEnd: OnDragEndResponder
  onRemoveItem: (id: string) => void
}

const DraggableList = ({ items, onDragEnd, onRemoveItem }: DraggableListProps) => {
  const [deleteItem, setDeleteItem] = React.useState<StockQuote | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)
  const handleRemoveItem = (id: string) => {
    setDeleteItem(null)
    setShowConfirmDelete(false)
    onRemoveItem(id)
  }
  const handleShowConfirmDelete = (item: StockQuote) => {
    setDeleteItem(item)
    setShowConfirmDelete(true)
  }
  const handleCancelDelete = () => {
    setShowConfirmDelete(false)
    setDeleteItem(null)
  }
  return (
    <>
      <ConfirmDeleteDialog
        show={showConfirmDelete}
        text={`are you sure you want to remove ${deleteItem?.Company}?`}
        onConfirm={() => handleRemoveItem(deleteItem!.Symbol)}
        onCancel={handleCancelDelete}
      />
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
                    handleShowConfirmDelete(item)
                  }}
                />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </>
  )
}
export default DraggableList
