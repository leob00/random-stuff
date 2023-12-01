import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications'
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart'

const ContextMenuPortfolio = ({ text = 'alerts' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <StackedLineChartIcon color='secondary' fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuPortfolio
