import Close from '@mui/icons-material/Close'
import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const ConfirmDialog = ({
  show,
  title,
  text,
  onConfirm,
  onCancel,
}: {
  show: boolean
  title: string
  text: string
  onConfirm: () => void
  onCancel: () => void
}) => {
  const handleClose = () => {
    onCancel()
  }
  const handleOnConfirm = () => {
    onConfirm()
  }
  return (
    <Box>
      <Dialog open={show} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title' sx={{ backgroundColor: CasinoBlueTransparent, color: 'white' }}>
          <Stack display='flex' direction={'row'}>
            <Stack flexGrow={1}>{title}</Stack>
            <Stack>
              <Button onClick={handleClose} sx={{ pl: 8 }}>
                <Close />
              </Button>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' sx={{ pt: 3 }} color='primary' variant='subtitle1'>
            {text}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ConfirmDialog
