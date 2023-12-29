import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import AssessmentIcon from '@mui/icons-material/Assessment'
const ContextMenuReport = ({ text = 'reports' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <AssessmentIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuReport
