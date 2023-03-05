import { Close } from '@mui/icons-material'
import { Box, Dialog, DialogTitle, Stack, Button, DialogContent, DialogContentText, Typography, Alert } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import PinInput from 'components/Atoms/Inputs/PinInput'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { myDecrypt, myEncrypt } from 'lib/backend/encryption/useEncryptor'
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
  const [profile, setProfile] = React.useState(userProfile)
  const userController = useUserController()

  const handleClose = async () => {
    onCancel()
  }
  const savePin = async (userPin: UserPin) => {
    const p = { ...profile, pin: userPin }
    setProfile(p)
    userController.setProfile(p)
    await putUserProfile(p)
    //console.log('saved pin')
    onConfirm(userPin)
  }

  const handleSetPin = async (text: string) => {
    console.log('text: ', text)
    if (text.length === 4) {
      const decryptedPin = myDecrypt(`${userProfile.id}${userProfile.username}`, userProfile.pin!.pin)
      //console.log(`decrypted user pin: ${decryptedPin} user pin: ${text}`)
      if (decryptedPin === text) {
        const updatedPin = { ...userProfile.pin! }
        updatedPin.lastEnterDate = dayjs().format()

        await savePin(updatedPin)
      } else {
        setError('incorrect pin')
      }
    } else {
      setError('pin is invalid')
    }
  }

  React.useEffect(() => {
    setError('')
  }, [])

  return (
    <Box>
      <Dialog open={show} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title' sx={{ backgroundColor: CasinoBlueTransparent, color: 'white' }}>
          <Stack display='flex' direction={'row'}>
            <Stack flexGrow={1}>{'Create pin'}</Stack>
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
            <Typography>
              You will be asked to enter your pin periodically to make sure your secrets are protected. Please try not to forget your pin! But if you do, you
              will need to reset it through an email confirmation... which is a hassle.
            </Typography>
          </Box>
          <Box py={2}>
            <CenterStack>
              <Box>
                <PinInput onConfirmed={handleSetPin} setFocus />
              </Box>
            </CenterStack>
            {error.length > 0 && (
              <Box py={2}>
                <CenterStack>
                  <Alert severity='error'>{error}</Alert>
                </CenterStack>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default EnterPinDialog
