import Close from '@mui/icons-material/Close'
import { Box, Dialog, DialogTitle, Stack, Button, DialogContent, DialogContentText } from '@mui/material'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import ReEnterPassword from './ReEnterPassword'

const ReEnterPasswordDialog = ({
  show,
  title,
  text,
  userProfile,
  onConfirm,
  onCancel,
}: {
  show: boolean
  title: string
  text: string
  userProfile: UserProfile
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
          <Box py={2}>
            <ReEnterPassword userProfile={userProfile} onSuccess={handleOnConfirm} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ReEnterPasswordDialog
