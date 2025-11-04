import Close from '@mui/icons-material/Close'
import { Chip, IconButton } from '@mui/material'

const CloseIconButton = ({ onClicked }: { onClicked: () => void }) => {
  const handleClicked = () => {
    onClicked()
  }
  return <Chip label={'close'} variant='outlined' onDelete={handleClicked} color='primary' />
}

export default CloseIconButton
