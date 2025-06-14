import { ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import DragIndicator from '@mui/icons-material/DragIndicator'
import HorizontalDivider from '../Dividers/HorizontalDivider'

const ListItemWithDrag = ({ id, title }: { id: string; title: string }) => {
  return (
    <>
      <ListItem id={id}>
        <ListItemAvatar>
          <DragIndicator />
        </ListItemAvatar>
        <ListItemText primary={`${title}`} secondary={``} />
      </ListItem>
      <HorizontalDivider />
    </>
  )
}

export default ListItemWithDrag
