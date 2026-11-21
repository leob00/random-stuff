import { Alert, Snackbar, Typography } from '@mui/material'

const SnackbarSuccess = ({ show, text, duration = 3000, onClose }: { show: boolean; text: string; duration?: number; onClose: () => void }) => {
  return (
    <Snackbar open={show} autoHideDuration={duration} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity='info' sx={{ width: '100%' }}>
        <Typography variant='body2' color='info'>
          {text}
        </Typography>
      </Alert>
    </Snackbar>
  )
}

export default SnackbarSuccess
