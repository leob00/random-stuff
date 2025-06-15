'use client'
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, TouchSensor, closestCenter, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { useState } from 'react'
import { SortableItem } from 'components/dnd/dndUtil'
import DraggableSortItemWrapper from 'components/dnd/DraggableSortItemWrapper'

export type DraggableEconListProps = {
  items: SortableItem[]
  onPushChanges: (items: SortableItem[]) => void
}

const DraggableEconList = ({ items, onPushChanges }: DraggableEconListProps) => {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor))
  const [activeItem, setActiveItem] = useState<SortableItem>()

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveItem(items.find((item) => item.id === active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeItem = items.find((item) => item.id === active.id)
    const overItem = items.find((item) => item.id === over.id)

    if (!activeItem || !overItem) {
      return
    }

    const activeIndex = items.findIndex((item) => item.id === active.id)
    const overIndex = items.findIndex((item) => item.id === over.id)

    if (activeIndex !== overIndex) {
      const newItems = arrayMove(items, activeIndex, overIndex)
      onPushChanges(newItems)
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
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {items.map((item) => (
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
export default DraggableEconList
