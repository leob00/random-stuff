import { Alert, Snackbar } from '@mui/material'

const SnackbarSuccess = ({ show, text, duration = 3000, onClose }: { show: boolean; text: string; duration?: number; onClose: () => void }) => {
  return (
    <Snackbar open={show} autoHideDuration={duration} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity='info' sx={{ width: '100%' }}>
        {text}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarSuccess
