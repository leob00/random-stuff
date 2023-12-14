import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications'

const ContextMenuAlert = ({ text = 'alerts' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <NotificationsIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuAlert
