import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart'
import { Typography } from '@mui/material'

const ContextMenuMyStocks = ({ text = 'my stocks' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <StackedLineChartIcon color='info' fontSize='small' />
      </ListItemIcon>
      <ListItemText color='info' primary={<Typography color='info'>{text}</Typography>} />
    </>
  )
}

export default ContextMenuMyStocks
