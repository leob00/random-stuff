import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import ViewListIcon from '@mui/icons-material/ViewList'
//import { Edit, Toc, ViewList } from '@mui/icons-material'
const ContextMenuEdit = () => {
  return (
    <>
      <ListItemIcon>
        <ViewListIcon color='secondary' fontSize='small' />
      </ListItemIcon>
      <ListItemText primary='edit' />
    </>
  )
}

export default ContextMenuEdit
