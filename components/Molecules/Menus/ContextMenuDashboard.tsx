import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import DashboardIcon from '@mui/icons-material/Dashboard'

const ContextMenuDashboard = ({ text = 'alerts' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <DashboardIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuDashboard
