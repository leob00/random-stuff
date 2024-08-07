import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart'

const ContextMenuPortfolio = ({ text = 'alerts' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <StackedLineChartIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuPortfolio
