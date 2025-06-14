import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { HTMLAttributes } from 'react'
import { TItem } from './DragAndDrop'
import Item from './Item'

type Props = {
  item: TItem
} & HTMLAttributes<HTMLDivElement>

const SortableItem = ({ item, ...props }: Props) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  })

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  }

  return <Item item={item} ref={setNodeRef} style={styles} isOpacityEnabled={isDragging} {...props} {...attributes} {...listeners} />
}

export default SortableItem
