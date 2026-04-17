import { ListItemIcon, ListItemText } from '@mui/material'
import TravelExploreIcon from '@mui/icons-material/TravelExplore'
const ContextMenuGoToPage = ({ text = 'go to page' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <TravelExploreIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuGoToPage
