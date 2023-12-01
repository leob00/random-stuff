import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import PeopleIcon from '@mui/icons-material/People'
const ContextMenuPeople = ({ text = 'edit' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <PeopleIcon color='secondary' fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuPeople
