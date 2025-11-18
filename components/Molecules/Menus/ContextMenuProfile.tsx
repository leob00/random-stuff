import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PersonIcon from '@mui/icons-material/Person'

const ContextMenuProfile = ({ text = 'profile' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <PersonIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuProfile
