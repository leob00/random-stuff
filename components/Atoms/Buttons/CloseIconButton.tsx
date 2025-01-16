import Close from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'

const CloseIconButton = ({ onClicked }: { onClicked: () => void }) => {
  return (
    <IconButton size='small' onClick={onClicked}>
      <Close color='primary' fontSize='small'></Close>
    </IconButton>
  )
}

export default CloseIconButton
