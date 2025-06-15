import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { HTMLAttributes } from 'react'
import { SortableItem } from 'components/dnd/dndUtil'
import DraggableListItem from './DraggableListItem'

type Props = {
  item: SortableItem
  isDragging?: boolean
} & HTMLAttributes<HTMLDivElement>

const DraggableSortItemWrapper = ({ item, ...props }: Props) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  })

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  }

  return (
    <DraggableListItem
      id={item.id}
      title={item.title}
      ref={setNodeRef}
      style={styles}
      isOpacityEnabled={isDragging}
      {...props}
      {...attributes}
      {...listeners}
    />
  )
}

export default DraggableSortItemWrapper
