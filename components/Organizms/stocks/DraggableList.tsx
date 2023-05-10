import * as React from 'react'
import DraggableListItem from './DraggableListItem'
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd'
import { quoteArraySchema, StockQuote } from 'lib/backend/api/models/zModels'
import { StrictModeDroppable } from './StrictModeDroppable'
import { Box, Button, Stack } from '@mui/material'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import { Close } from '@mui/icons-material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import StockEditMenu from 'components/Molecules/Menus/StockEditMenu'

export type DraggableListProps = {
  items: StockQuote[]
  onDragEnd: OnDragEndResponder
  onRemoveItem: (id: string) => void
  onCancelEdit: () => void
}

export interface SelectableQuote extends StockQuote {
  selected?: boolean
}

const DraggableList = ({ items, onDragEnd, onRemoveItem, onCancelEdit }: DraggableListProps) => {
  const [deleteItem, setDeleteItem] = React.useState<StockQuote | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)
  const [showConfirmDeleteMulti, setShowConfirmDeleteMulti] = React.useState(false)
  const selecteableItems: SelectableQuote[] = items.map((item) => item)
  const itemMap = getMapFromArray(selecteableItems, 'Symbol')
  const [map, setMap] = React.useState(itemMap)
  //const [data, setData] = React.useState(selecteableItems)
  const [selectedItems, setSelectedItems] = React.useState(selecteableItems.filter((item) => item.selected))
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

  const handleDeleteMulti = () => {
    const toDelete = [...selectedItems]
  }
  const handleShowConfirmDeleteMulti = () => {
    console.log('called')
    setShowConfirmDeleteMulti(true)
    const toDelete = [...selectedItems]
  }

  const handleCheckItem = (symbol: string, checked: boolean) => {
    const quote = map.get(symbol)!
    quote.selected = checked
    map.set(symbol, quote)
    setMap(map)
    const selected = getListFromMap(map).filter((item) => item.selected)
    setSelectedItems(selected)
    //console.log('selected items: ', selected.length)
  }

  return (
    <>
      <ConfirmDeleteDialog
        show={showConfirmDelete}
        text={`are you sure you want to remove ${deleteItem?.Company}?`}
        onConfirm={() => handleRemoveItem(deleteItem!.Symbol)}
        onCancel={handleCancelDelete}
      />
      <ConfirmDeleteDialog
        show={showConfirmDeleteMulti}
        text={`are you sure you want to remove ${selectedItems.map((o) => o.Symbol).join(',')}}?`}
        onConfirm={handleDeleteMulti}
        onCancel={handleCancelDelete}
      />
      <Box py={2} display='flex' justifyContent={'space-between'} alignItems={'center'}>
        <Box>
          {selectedItems.length > 0 && (
            <Box>
              <StockEditMenu onDelete={handleShowConfirmDeleteMulti} />
            </Box>
          )}
        </Box>
        <Box>
          <Button size='small' color='secondary' onClick={onCancelEdit}>
            <Close fontSize='small' color='secondary' />
          </Button>
        </Box>
      </Box>
      <HorizontalDivider />
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
                  onCheckItem={(checked: boolean) => {
                    handleCheckItem(item.Symbol, checked)
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
