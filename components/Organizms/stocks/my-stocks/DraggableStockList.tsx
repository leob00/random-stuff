'use client'
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, TouchSensor, closestCenter, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { useState } from 'react'
import { getSortablePropsFromArray, SortableItem } from 'components/dnd/dndUtil'
import DraggableSortItemWrapper from 'components/dnd/DraggableSortItemWrapper'
import { StockQuote } from 'lib/backend/api/models/zModels'

const DraggableStockList = ({ items, onPushChanges }: { items: StockQuote[]; onPushChanges: (items: StockQuote[]) => void }) => {
  const sortableItems = getSortablePropsFromArray(items, 'Symbol', 'Company')

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor))
  const [activeItem, setActiveItem] = useState<SortableItem>()

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveItem(sortableItems.find((item) => item.id === active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeItem = sortableItems.find((item) => item.id === active.id)
    const overItem = sortableItems.find((item) => item.id === over.id)

    if (!activeItem || !overItem) {
      return
    }

    const activeIndex = sortableItems.findIndex((item) => item.id === active.id)
    const overIndex = sortableItems.findIndex((item) => item.id === over.id)

    if (activeIndex !== overIndex) {
      const newItems = arrayMove(sortableItems, activeIndex, overIndex)
      onPushChanges(newItems.flatMap((m) => m.data) as StockQuote[])
    }
    setActiveItem(undefined)
  }

  return (
    <>
      <Box py={2} display='flex' justifyContent={'space-between'} alignItems={'center'}></Box>
      <Box pb={2}>
        <CenterStack>
          <Typography variant='body2'>You can reorder your list by dragging and dropping items.</Typography>
        </CenterStack>
      </Box>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <SortableContext items={sortableItems} strategy={rectSortingStrategy}>
          {sortableItems.map((item) => (
            <DraggableSortItemWrapper key={item.id} item={item} />
          ))}
        </SortableContext>
        <DragOverlay adjustScale style={{ transformOrigin: '0 0 ' }}>
          {activeItem && <DraggableSortItemWrapper item={activeItem} isDragging />}
        </DragOverlay>
      </DndContext>
    </>
  )
}
export default DraggableStockList
