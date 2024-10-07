import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import ShareIcon from '@mui/icons-material/Share'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const ContextMenuShare = ({ text = 'share' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <ShareIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
      <HorizontalDivider />
    </>
  )
}

export default ContextMenuShare
