import { IconButton } from '@mui/material'
import FirstPageIcon from '@mui/icons-material/FirstPage'

const ArrowFirstPageButton = ({ disabled, onClicked }: { disabled: boolean; onClicked: () => void }) => {
  return (
    <IconButton size='small' onClick={onClicked} disabled={disabled}>
      <FirstPageIcon fontSize='small' color={disabled ? 'disabled' : 'primary'} />
    </IconButton>
  )
}

export default ArrowFirstPageButton
