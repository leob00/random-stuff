//import Close from '@mui/icons-material/Close'
import CancelIcon from '@mui/icons-material/Cancel'
import { Button, IconButton, Typography, useTheme } from '@mui/material'

const CloseIconButton = ({ onClicked }: { onClicked: () => void }) => {
  const handleClicked = () => {
    onClicked()
  }
  const theme = useTheme()
  return (
    <>
      <Button
        size='small'
        variant='outlined'
        sx={{ borderRadius: 140 }}
        onClick={handleClicked}
        endIcon={
          <IconButton size='small' onClick={handleClicked} color='primary'>
            <CancelIcon fontSize='small' />
          </IconButton>
        }
      >
        <Typography pl={1} variant='body2'>
          close
        </Typography>
      </Button>
      {/* <Chip label={'close'} variant='outlined' onDelete={handleClicked} color='primary' /> */}
    </>
  )
}

export default CloseIconButton
