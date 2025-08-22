import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
const ContextMenuCrypto = ({ text = 'reports' }: { text?: string }) => {
  return (
    <>
      <ListItemIcon>
        <CurrencyBitcoinIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText primary={text} />
    </>
  )
}

export default ContextMenuCrypto
