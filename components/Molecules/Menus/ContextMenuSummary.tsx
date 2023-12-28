import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import BarChartIcon from '@mui/icons-material/BarChart'
const ContextMenuSummary = ({ text = 'summary' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <BarChartIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuSummary
