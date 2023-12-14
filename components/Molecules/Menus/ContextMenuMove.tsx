import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import Move from '@mui/icons-material/Input'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const ContextMenuMove = ({ text = 'add' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <Move fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
      <HorizontalDivider />
    </>
  )
}

export default ContextMenuMove
