import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import CachedIcon from '@mui/icons-material/Cached'
const ContextMenuRefresh = () => {
  return (
    <>
      <ListItemIcon>
        <CachedIcon color='secondary' fontSize='small' />
      </ListItemIcon>
      <ListItemText primary='refresh' />
    </>
  )
}

export default ContextMenuRefresh
