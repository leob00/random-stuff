import { ListItemIcon, ListItemText, Typography } from '@mui/material'

import Icon from '@mui/icons-material/Delete'

const ContextMenuDelete = ({ text = 'remove' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <Icon color='error' fontSize='small' />
      </ListItemIcon>
      <ListItemText color='info' primary={<Typography color='warning'>{text}</Typography>} />
    </>
  )
}

export default ContextMenuDelete
