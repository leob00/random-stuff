import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
const ContextMenuEdit = ({ text = 'edit' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <EditIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuEdit
