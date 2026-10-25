import ListItemIcon from '@mui/material/ListItemIcon'
import Icon from '@mui/icons-material/KeyboardDoubleArrowUp'
import { ListItemText } from '@mui/material'
const ContextMenuMoveToTop = ({ text = 'move to top' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <Icon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuMoveToTop
