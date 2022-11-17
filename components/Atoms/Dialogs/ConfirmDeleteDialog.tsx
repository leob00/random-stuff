import { Divider } from '@aws-amplify/ui-react'
import { Close } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from '@mui/material'
import { CasinoGrayTransparent, CasinoPinkTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import React from 'react'
import DangerButton from '../Buttons/DangerButton'
import PassiveButton from '../Buttons/PassiveButton'
import SecondaryButton from '../Buttons/SecondaryButton'
import HorizontalDivider from '../Dividers/HorizontalDivider'

const ConfirmDeleteDialog = ({
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
  //const [open, setOpen] = React.useState(show)
  const handleClose = () => {
    // setOpen(false)
    onCancel()
  }
  const handleOnConfirm = () => {
    //setOpen(false)
    onConfirm()
  }
  return (
    <Box>
      <Dialog open={show} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title' sx={{ backgroundColor: CasinoPinkTransparent, color: 'white' }}>
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
        <HorizontalDivider />
        <DialogActions sx={{ pt: 1, pb: 2 }}>
          <DangerButton onClick={handleOnConfirm} autoFocus text={'yes'} />
          <PassiveButton onClick={handleClose} text={'no'} />
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ConfirmDeleteDialog
