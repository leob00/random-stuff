import CancelIcon from '@mui/icons-material/Cancel'
import { Button, Typography } from '@mui/material'

const CloseIconButton = ({ onClicked }: { onClicked: () => void }) => {
  const handleClicked = () => {
    onClicked()
  }
  return (
    <>
      <Button size='small' variant='outlined' sx={{ borderRadius: 6 }} onClick={handleClicked} endIcon={<CancelIcon fontSize='small' />}>
        <Typography pl={1} variant='body2'>
          close
        </Typography>
      </Button>
    </>
  )
}

export default CloseIconButton
