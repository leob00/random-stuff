import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'

const ContextMenuRequestQuote = ({ text = 'calendar' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <RequestQuoteIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuRequestQuote
