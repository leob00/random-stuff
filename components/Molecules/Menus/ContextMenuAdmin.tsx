import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'

const ContextMenuAdmin = ({ text = 'admin' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <SupervisorAccountIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuAdmin
