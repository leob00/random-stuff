import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const ContextMenuAttach = ({ text = 'add file' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <AttachFileIcon color='primary' fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
      <HorizontalDivider />
    </>
  )
}

export default ContextMenuAttach
