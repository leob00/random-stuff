import { CSSProperties, ForwardedRef, forwardRef, HTMLAttributes } from 'react'
import { Box } from '@mui/material'
import ListItemWithDrag from 'components/Atoms/Lists/ListItemWithDrag'
type Props = {
  id: string
  title: string
  isOpacityEnabled?: boolean
  isDragging?: boolean
  disableShowHide?: boolean
  ref: ForwardedRef<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

const DraggableListItem = ({ id, title, isOpacityEnabled, isDragging, style, ref, ...props }: Props) => {
  const styles: CSSProperties = {
    opacity: isOpacityEnabled ? '0.08' : '1',
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
}

export default DraggableListItem
