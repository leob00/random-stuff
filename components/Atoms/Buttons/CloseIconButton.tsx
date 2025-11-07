import Close from '@mui/icons-material/Close'
import { Button, Chip, IconButton } from '@mui/material'

const CloseIconButton = ({ onClicked }: { onClicked: () => void }) => {
  const handleClicked = () => {
    onClicked()
  }
  return (
    <Button sx={{ borderRadius: '12px' }} onClick={handleClicked}>
      <Chip label={'close'} variant='outlined' onDelete={handleClicked} color='primary' />
    </Button>
  )
}

export default CloseIconButton
