import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import OilBarrelIcon from '@mui/icons-material/OilBarrel'
const ContextMenuCommodities = ({ text = 'commodities' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <OilBarrelIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuCommodities
