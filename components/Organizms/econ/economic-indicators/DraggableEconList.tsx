'use client'
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, TouchSensor, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import DraggableListItem from 'components/Organizms/dashboard/DraggableListItem'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import DraggableEconListItem from './DraggableEconListItem'

export type SortableEconDataItem = {
  id: string
  title: string
} & EconomicDataItem

export type DraggableEconListProps = {
  items: SortableEconDataItem[]
  onPushChanges: (items: EconomicDataItem[]) => void
}

const DraggableEconList = ({ items, onPushChanges }: DraggableEconListProps) => {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor))

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
  }

  return (
    <>
      <Box py={2} display='flex' justifyContent={'space-between'} alignItems={'center'}></Box>
      <Box pb={2}>
        <CenterStack>
          <Typography variant='body2'>You can reorder your list by dragging and dropping items.</Typography>
        </CenterStack>
      </Box>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {items.map((item) => (
            <DraggableEconListItem key={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
    </>
  )
}
export default DraggableEconList
