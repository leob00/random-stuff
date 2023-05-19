import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { Delete } from '@mui/icons-material'

const ContextMenuDelete = () => {
  return (
    <>
      <ListItemIcon>
        <Delete color='error' fontSize='small' />
      </ListItemIcon>
      <ListItemText primary='remove'></ListItemText>
    </>
  )
}

export default ContextMenuDelete
