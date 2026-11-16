import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Icon from '@mui/icons-material/Redeem'
import { Typography } from '@mui/material'
const ContextMenuTreasuries = ({ text = 'treasuries' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <Icon color='info' fontSize='small' />
      </ListItemIcon>
      <ListItemText color='info' primary={<Typography color='info'>{text}</Typography>} />
    </>
  )
}

export default ContextMenuTreasuries
