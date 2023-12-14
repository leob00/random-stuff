import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const ContextMenuView = ({ text = 'view' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <ZoomInIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
      <HorizontalDivider />
    </>
  )
}

export default ContextMenuView
