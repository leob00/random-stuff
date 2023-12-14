import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import Close from '@mui/icons-material/Close'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const ContextMenuClose = ({ text = 'close' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <Close fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
      <HorizontalDivider />
    </>
  )
}

export default ContextMenuClose
