import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import BarChartIcon from '@mui/icons-material/BarChart'
import { Typography } from '@mui/material'
const ContextMenuAllStocks = ({ text = 'stocks' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <BarChartIcon color='info' fontSize='small' />
      </ListItemIcon>
      <ListItemText color='info' primary={<Typography color='info'>{text}</Typography>} />
    </>
  )
}

export default ContextMenuAllStocks
