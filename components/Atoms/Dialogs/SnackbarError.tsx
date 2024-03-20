import { Alert, Snackbar } from '@mui/material'
import { CasinoRedTransparent } from 'components/themes/mainTheme'
import React from 'react'

const SnackbarError = ({ show, text, duration = 3000 }: { show: boolean; text: string; duration?: number }) => {
  const [open, setOpen] = React.useState(show)
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={handleClose} severity='error' sx={{ width: '100%', backgroundColor: CasinoRedTransparent, color: 'white' }}>
        {text}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarError
