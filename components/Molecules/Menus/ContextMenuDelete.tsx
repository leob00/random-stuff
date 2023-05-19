import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { Delete } from '@mui/icons-material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const ContextMenuDelete = () => {
  return (
    <>
      <ListItemIcon>
        <Delete color='error' fontSize='small' />
      </ListItemIcon>
      <ListItemText primary='remove' />
      <HorizontalDivider />
    </>
  )
}

export default ContextMenuDelete
