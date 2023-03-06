import { Alert, Snackbar } from '@mui/material'
import React from 'react'

const SnackbarSuccess = ({ show, text, duration = 3000 }: { show: boolean; text: string; duration?: number }) => {
  const [open, setOpen] = React.useState(show)
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
        {text}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarSuccess
