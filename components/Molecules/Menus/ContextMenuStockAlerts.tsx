import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import NotificationsIcon from '@mui/icons-material/Notifications'
const ContextMenuStockAlerts = ({ text = 'stock alerts' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <NotificationsIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuStockAlerts
