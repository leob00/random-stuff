import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
const ContextMenuIndicators = ({ text = 'indicators' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <QueryStatsIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuIndicators
