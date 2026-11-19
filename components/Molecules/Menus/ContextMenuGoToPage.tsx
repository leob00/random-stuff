import { ListItemIcon, ListItemText, Typography } from '@mui/material'
import Icon from '@mui/icons-material/TravelExplore'
const ContextMenuGoToPage = ({ text = 'go to page' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <Icon color='info' fontSize='small' />
      </ListItemIcon>
      <ListItemText color='info' primary={<Typography color='info'>{text}</Typography>} />
    </>
  )
}

export default ContextMenuGoToPage
