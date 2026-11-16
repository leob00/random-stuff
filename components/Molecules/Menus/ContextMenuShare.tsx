import { ListItemIcon, ListItemText, Typography } from '@mui/material'
import Icon from '@mui/icons-material/Share'

const ContextMenuShare = ({ text = 'share' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <Icon color='info' fontSize='small' />
      </ListItemIcon>
      <ListItemText color='info' primary={<Typography color='info'>{text}</Typography>} />
    </>
  )
}

export default ContextMenuShare
