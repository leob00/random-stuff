import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import Delete from '@mui/icons-material/Delete'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const ContextMenuDelete = ({ text = 'remove' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <Delete color='error' fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
      <HorizontalDivider />
    </>
  )
}

export default ContextMenuDelete
