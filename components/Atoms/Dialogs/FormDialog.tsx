import Close from '@mui/icons-material/Close'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, IconButton } from '@mui/material'
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
  showActionButtons = true,
  fullScreen,
}: {
  children: ReactNode
  title: string
  show: boolean
  onCancel?: () => void
  onSave?: () => void
  showActionButtons?: boolean
  fullScreen?: boolean
}) => {
  const handleClose = () => {
    onCancel?.()
  }

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='lg'
      fullScreen={fullScreen}
      PaperProps={{ elevation: 0 }}
    >
      <DialogTitle id='alert-dialog-title' sx={{ backgroundColor: CasinoBlueTransparent, color: 'white' }}>
        <Stack display='flex' direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Stack>{title}</Stack>
          <Stack>
            <IconButton onClick={handleClose}>
              <Close fontSize='small' />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description' sx={{ pt: 3 }} color='primary'></DialogContentText>
        {children}
      </DialogContent>
      {showActionButtons && (
        <>
          <HorizontalDivider />
          <DialogActions sx={{ pt: 1, pb: 2 }}>
            {onSave && <SecondaryButton text={'save'} size='small' width={80} onClick={onSave} />}
            {onCancel && <PassiveButton onClick={handleClose} text={'close'} size='small' width={80} />}
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default FormDialog
