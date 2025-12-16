import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import SummarizeIcon from '@mui/icons-material/Summarize'
const ContextMenuSummary = ({ text = 'summary' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <SummarizeIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuSummary
