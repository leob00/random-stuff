import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import BarChartIcon from '@mui/icons-material/BarChart'
const ContextMenuAllStocks = ({ text = 'edit' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <BarChartIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuAllStocks
