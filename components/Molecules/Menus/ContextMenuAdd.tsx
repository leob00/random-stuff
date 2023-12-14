import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import Add from '@mui/icons-material/Add'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const ContextMenuAdd = ({ text = 'add' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <Add fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
      <HorizontalDivider />
    </>
  )
}

export default ContextMenuAdd
