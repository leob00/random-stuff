import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import SignOutIcon from '@mui/icons-material/Logout'
const ContextMenuSignOut = ({ text = 'sign out' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <SignOutIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text}></ListItemText>
    </>
  )
}

export default ContextMenuSignOut
