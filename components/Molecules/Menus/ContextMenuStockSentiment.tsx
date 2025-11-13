import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'
const ContextMenuStockSentiment = ({ text = 'sentiment' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <SentimentVerySatisfiedIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuStockSentiment
