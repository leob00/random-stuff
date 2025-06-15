import { useRef, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, TouchSensor, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from './SortableItem'
import Item from './Item'
import { Box } from '@mui/material'

export type TItem = {
  id: number
  imageUrl: string
}

const defaultItems = [
  {
    id: 2,
    imageUrl: `https://picsum.photos/id/2/300/200`,
  },
  {
    id: 15,
    imageUrl: `https://picsum.photos/id/15/300/200`,
  },
  {
    id: 20,
    imageUrl: `https://picsum.photos/id/20/300/200`,
  },
  {
    id: 24,
    imageUrl: `https://picsum.photos/id/24/300/200`,
  },
  {
    id: 32,
    imageUrl: `https://picsum.photos/id/13/300/200`,
  },
  {
    id: 35,
    imageUrl: `https://picsum.photos/id/48/300/200`,
  },
  {
    id: 39,
    imageUrl: `https://picsum.photos/id/40/300/200`,
  },
  {
    id: 43,
    imageUrl: `https://picsum.photos/id/43/300/200`,
  },
  {
    id: 46,
    imageUrl: `https://picsum.photos/id/46/300/200`,
  },
  {
    id: 52,
    imageUrl: `https://picsum.photos/id/52/300/200`,
  },
  {
    id: 56,
    imageUrl: `https://picsum.photos/id/60/300/200`,
  },
]

export default function DragAndDrop() {
  const [items, setItems] = useState<TItem[]>(defaultItems)

  // for drag overlay
  const [activeItem, setActiveItem] = useState<TItem>()

  // for input methods detection
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor))

  // triggered when dragging starts
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveItem(items.find((item) => item.id === active.id))
  }

  // triggered when dragging ends
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
      setItems((prev) => arrayMove<TItem>(prev, activeIndex, overIndex))
    }
    setActiveItem(undefined)
  }

  const handleDragCancel = () => {
    setActiveItem(undefined)
  }

  const handleButtonClick = () => {
    const itemIds = items.map((item) => item.id)
    alert(itemIds)
  }
  const itemRef = useRef<HTMLDivElement>(null)
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <Box>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </Box>
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: '0 0 ' }}>
        {activeItem ? <Item item={activeItem} isDragging ref={itemRef} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
