import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
//import { Edit, Toc, ViewList } from '@mui/icons-material'
const ContextMenuEdit = ({ text = 'edit' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <EditIcon color='secondary' fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuEdit
