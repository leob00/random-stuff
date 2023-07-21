import Close from '@mui/icons-material/Close'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, IconButton } from '@mui/material'
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
}: {
  children: ReactNode
  title: string
  show: boolean
  onCancel?: () => void
  onSave?: () => void
  showActionButtons?: boolean
}) => {
  //const [open, setOpen] = React.useState(show)
  const handleClose = () => {
    // setOpen(false)
    onCancel?.()
  }

  return (
    <Box>
      <Dialog open={show} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description' maxWidth='lg'>
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
              {onCancel && <PassiveButton onClick={handleClose} text={'cancel'} size='small' width={80} />}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default FormDialog
