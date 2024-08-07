import { Alert, Snackbar } from '@mui/material'
import React from 'react'

const SnackbarWarning = ({ show, text, duration = 3000, onClose }: { show: boolean; text: string; duration?: number; onClose: () => void }) => {
  return (
    <Snackbar open={show} autoHideDuration={duration} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity='warning' sx={{ width: '100%' }}>
        {text}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarWarning
