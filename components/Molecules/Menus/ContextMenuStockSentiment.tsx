import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'
import { Typography } from '@mui/material'
const ContextMenuStockSentiment = ({ text = 'sentiment' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <SentimentVerySatisfiedIcon color='info' fontSize='small' />
      </ListItemIcon>
      <ListItemText color='info' primary={<Typography color='info'>{text}</Typography>} />
    </>
  )
}

export default ContextMenuStockSentiment
