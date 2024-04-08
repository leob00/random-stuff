import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import LoginIcon from '@mui/icons-material/Login'
const ContextMenuSignIn = ({ text = 'sign in' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <LoginIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text}></ListItemText>
    </>
  )
}

export default ContextMenuSignIn
