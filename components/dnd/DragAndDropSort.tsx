'use client'
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, TouchSensor, closestCenter, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Box, Typography, IconButton } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CenterStack from 'components/Atoms/CenterStack'
import { useState } from 'react'
import { SortableItem } from 'components/dnd/dndUtil'
import DraggableSortItemWrapper from 'components/dnd/DraggableSortItemWrapper'

const DragAndDropSort = ({ items, onPushChanges }: { items: SortableItem[]; onPushChanges: (items: SortableItem[]) => void }) => {
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

  const moveItem = (id: string, toIndex: number) => {
    const fromIndex = items.findIndex((it) => it.id === id)
    if (fromIndex === -1 || toIndex < 0 || toIndex >= items.length) return
    if (fromIndex === toIndex) return
    const newItems = arrayMove(items, fromIndex, toIndex)
    onPushChanges(newItems)
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
          {items.map((item, idx) => (
            <Box key={item.id} display='flex' alignItems='center' justifyContent='space-between' mb={1}>
              <Box flex={1} mr={1}>
                <DraggableSortItemWrapper item={item} style={{ width: '100%' }} />
              </Box>
              <Box display='flex' flexDirection='column'>
                <IconButton size='small' aria-label='move up' disabled={idx === 0} onClick={() => moveItem(item.id, idx - 1)}>
                  <ArrowUpwardIcon fontSize='small' />
                </IconButton>
                <IconButton size='small' aria-label='move down' disabled={idx === items.length - 1} onClick={() => moveItem(item.id, idx + 1)}>
                  <ArrowDownwardIcon fontSize='small' />
                </IconButton>
              </Box>
            </Box>
          ))}
        </SortableContext>
        <DragOverlay adjustScale style={{ transformOrigin: '0 0 ' }}>
          {activeItem && <DraggableSortItemWrapper item={activeItem} isDragging />}
        </DragOverlay>
      </DndContext>
    </>
  )
}
export default DragAndDropSort
