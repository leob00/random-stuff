import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications'
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart'

const ContextMenuAlert = ({ text = 'alerts' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <NotificationsIcon color='primary' fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuAlert
