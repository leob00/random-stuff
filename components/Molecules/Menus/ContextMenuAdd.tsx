import { ListItemIcon, ListItemText, Typography } from '@mui/material'
import Icon from '@mui/icons-material/Add'

const ContextMenuAdd = ({ text = 'add' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <Icon color='info' fontSize='small' />
      </ListItemIcon>
      <ListItemText color='info' primary={<Typography color='info'>{text}</Typography>} />
    </>
  )
}

export default ContextMenuAdd
