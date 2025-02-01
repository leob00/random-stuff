import { IconButton } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

const ArrowLeftButton = ({ disabled, onClicked }: { disabled: boolean; onClicked: () => void }) => {
  return (
    <IconButton size='small' onClick={onClicked} disabled={disabled}>
      <KeyboardArrowLeftIcon fontSize='small' color='primary' />
    </IconButton>
  )
}

export default ArrowLeftButton
