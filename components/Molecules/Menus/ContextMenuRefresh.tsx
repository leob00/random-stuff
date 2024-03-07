import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import CachedIcon from '@mui/icons-material/Cached'
const ContextMenuRefresh = ({ text = 'refresh' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <CachedIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuRefresh
