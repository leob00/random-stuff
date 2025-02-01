import { IconButton } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

const ArrowRightButton = ({ disabled, onClicked }: { disabled: boolean; onClicked: () => void }) => {
  return (
    <IconButton size='small' onClick={onClicked} disabled={disabled}>
      <KeyboardArrowRightIcon fontSize='small' color='primary' />
    </IconButton>
  )
}

export default ArrowRightButton
