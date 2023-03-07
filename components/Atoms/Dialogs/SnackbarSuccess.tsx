import { Alert, Snackbar } from '@mui/material'
import { CasinoBlue, CasinoBlueTransparent, CasinoGreen, CasinoWhiteTransparent } from 'components/themes/mainTheme'
import React from 'react'

const SnackbarSuccess = ({ show, text, duration = 3000 }: { show: boolean; text: string; duration?: number }) => {
  const [open, setOpen] = React.useState(show)
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={handleClose} severity='info' sx={{ width: '100%', backgroundColor: CasinoBlue, color: 'white' }}>
        {text}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarSuccess
