import { Close } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import React, { ReactNode } from 'react'
import PassiveButton from '../Buttons/PassiveButton'
import SecondaryButton from '../Buttons/SecondaryButton'
import HorizontalDivider from '../Dividers/HorizontalDivider'

const FormDialog = ({
  children,
  title,
  show,
  onCancel,
  onSave,
}: {
  children: ReactNode
  title: string
  show: boolean
  onCancel: () => void
  onSave: () => void
}) => {
  //const [open, setOpen] = React.useState(show)
  const handleClose = () => {
    // setOpen(false)
    onCancel()
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
          <DialogContentText id='alert-dialog-description' sx={{ pt: 3 }} color='primary'></DialogContentText>
          {children}
        </DialogContent>
        <HorizontalDivider />
        <DialogActions sx={{ pt: 1, pb: 2 }}>
          <SecondaryButton text={'save'} size='small' width={80} onClick={onSave} />
          <PassiveButton onClick={handleClose} text={'cancel'} size='small' width={80} />
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FormDialog
