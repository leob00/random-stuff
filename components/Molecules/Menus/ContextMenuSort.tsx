import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import SortIcon from '@mui/icons-material/Sort'
const ContextMenuSort = ({ text = 'edit' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <SortIcon color='secondary' fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuSort
