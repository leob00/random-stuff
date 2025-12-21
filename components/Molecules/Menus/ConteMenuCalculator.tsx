import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CalculateIcon from '@mui/icons-material/Calculate'

const ConteMenuCalculator = ({ text = 'my stocks' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <CalculateIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ConteMenuCalculator
