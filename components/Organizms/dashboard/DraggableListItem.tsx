import { CSSProperties, forwardRef, HTMLAttributes } from 'react'
import { Box } from '@mui/material'
import ListItemWithDrag from 'components/Atoms/Lists/ListItemWithDrag'
type Props = {
  id: string
  title: string
  isOpacityEnabled?: boolean
  isDragging?: boolean
  disableShowHide?: boolean
} & HTMLAttributes<HTMLDivElement>

const DraggableListItem = forwardRef<HTMLDivElement, Props>(({ id, title, isOpacityEnabled, isDragging, style, ...props }, ref) => {
  const styles: CSSProperties = {
    opacity: isOpacityEnabled ? '0.4' : '1',
    cursor: isDragging ? 'grabbing' : 'grab',
    lineHeight: '0.5',
    transform: isDragging ? 'scale(1.05)' : 'scale(1)',
    ...style,
  }

  return (
    <Box ref={ref} style={styles} {...props}>
      <ListItemWithDrag id={id} title={title} />
    </Box>
  )
})
DraggableListItem.displayName = 'DraggableListItem'
export default DraggableListItem
