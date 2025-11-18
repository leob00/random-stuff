import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import RedeemIcon from '@mui/icons-material/Redeem'
const ContextMenuTreasuries = ({ text = 'treasuries' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <RedeemIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuTreasuries
