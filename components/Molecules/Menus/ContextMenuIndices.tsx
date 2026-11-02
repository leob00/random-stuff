import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Icon from '@mui/icons-material/StackedBarChart'
const ContextMenuIndices = ({ text = 'indices' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <Icon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuIndices
