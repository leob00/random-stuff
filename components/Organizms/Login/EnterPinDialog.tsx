import { Close } from '@mui/icons-material'
import { Box, Dialog, DialogTitle, Stack, Button, DialogContent, DialogContentText, Typography, Alert, Link } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import PinInput from 'components/Atoms/Inputs/PinInput'
import WarmupBox from 'components/Atoms/WarmupBox'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { UserPin, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import React from 'react'
const EnterPinDialog = ({
  show,
  userProfile,
  onConfirm,
  onCancel,
}: {
  show: boolean
  userProfile: UserProfile
  onConfirm: (userPin: UserPin) => void
  onCancel: () => void
}) => {
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [open, setOpen] = React.useState(show)

  const handleClose = async () => {
    onCancel()
  }
  const savePin = async (userPin: UserPin) => {
    //setIsLoading(true)
    // const p = { ...userProfile, pin: userPin }
    //setIsLoading(false)
    //onConfirm(userPin)
  }

  const handleSetPin = async (text: string) => {
    if (text.length === 4) {
      const decryptedPin = myDecrypt(`${userProfile.id}${userProfile.username}`, userProfile.pin!.pin)
      if (decryptedPin === text) {
        const updatedPin = { ...userProfile.pin! }
        updatedPin.lastEnterDate = dayjs().format()
        setError('')
        setIsLoading(true)
        onConfirm(updatedPin)
        setOpen(false)
      } else {
        setError('incorrect pin')
        console.log('incorrect pin')
        setIsLoading(false)
      }
    } else {
      setError('pin is invalid')
      console.log('pin is invalid')
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    setError('')
  }, [])

  return (
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title' sx={{ backgroundColor: CasinoBlueTransparent, color: 'white' }}>
          <Stack display='flex' direction={'row'}>
            <Stack flexGrow={1}>{'Enter pin'}</Stack>
            <Stack>
              <Button onClick={handleClose} sx={{ pl: 8 }}>
                <Close />
              </Button>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' sx={{ pt: 3 }} color='primary' variant='subtitle1'>
            Please enter your pin.
          </DialogContentText>
          <Box py={2}>
            <Box>
              <Typography>{`You will be asked to enter your pin periodically to make sure your secrets are protected. Please try not to forget your pin! But if you do, you
              can always reset it in your profle settings. `}</Typography>
              <Link href={'/protected/csr/profile'} color={'secondary'}>
                reset pin
              </Link>
              .
            </Box>
          </Box>
          <Box py={2}>
            <CenterStack>
              <Box>
                <PinInput onConfirmed={handleSetPin} setFocus />
              </Box>
            </CenterStack>
            <Box height={100} pb={2}>
              {error.length > 0 && (
                <Box py={2}>
                  <CenterStack>
                    <Alert severity='error'>{error}</Alert>
                  </CenterStack>
                </Box>
              )}
              {isLoading && <WarmupBox text='validating pin...' />}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default EnterPinDialog
