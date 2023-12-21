import Close from '@mui/icons-material/Close'
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack } from '@mui/material'
import { DarkMode } from 'components/themes/DarkMode'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import React, { ReactNode } from 'react'
import PassiveButton from '../Buttons/PassiveButton'
import SecondaryButton from '../Buttons/SecondaryButton'
import HorizontalDivider from '../Dividers/HorizontalDivider'

const InfoDialog = ({
  children,
  title,
  show,
  onCancel,
  onSave,
  fullScreen = true,
}: {
  children: ReactNode
  title: string
  show: boolean
  onCancel?: () => void
  onSave?: () => void
  fullScreen?: boolean
}) => {
  const handleClose = () => {
    onCancel?.()
  }

  return (
    <Box>
      <Dialog
        open={show}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='lg'
        fullWidth
        fullScreen={fullScreen}
      >
        <DialogTitle id='alert-dialog-title' sx={{ backgroundColor: CasinoBlueTransparent, color: 'white' }}>
          <Stack display='flex' direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Box>{title}</Box>
            <Box sx={{ marginRight: -2 }}>
              <DarkMode>
                <IconButton onClick={handleClose} size='small'>
                  <Close fontSize='small' />
                </IconButton>
              </DarkMode>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' sx={{ pt: 3 }} color='primary'></DialogContentText>
          {children}
        </DialogContent>
        <HorizontalDivider />
        <DialogActions sx={{ pt: 1, pb: 2 }}>
          {onSave && <SecondaryButton text={'save'} size='small' width={80} onClick={onSave} />}
          <PassiveButton onClick={handleClose} text={'close'} size='small' width={80} />
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default InfoDialog
