import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { HTMLAttributes } from 'react'
import { SortableEconDataItem } from './DraggableEconList'
import DraggableListItem from 'components/Organizms/dashboard/DraggableListItem'

type Props = {
  item: SortableEconDataItem
} & HTMLAttributes<HTMLDivElement>

const DraggableEconListItem = ({ item, ...props }: Props) => {
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

export default DraggableEconListItem
