import { Close } from '@mui/icons-material'
import { Box, Dialog, DialogTitle, Stack, Button, DialogContent, DialogContentText, Typography, Alert } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import PinInput from 'components/Atoms/Inputs/PinInput'
import WarmupBox from 'components/Atoms/WarmupBox'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { UserPin, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { myEncrypt } from 'lib/backend/encryption/useEncryptor'
import React from 'react'

const CreatePinDialog = ({
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
  const [pin, setPin] = React.useState('')
  const [profile, setProfile] = React.useState(userProfile)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClose = async () => {
    setPin('')
    onCancel()
  }
  const savePin = async () => {
    const userPin: UserPin = {
      pin: myEncrypt(`${profile.id}${profile.username}`, pin),
      lastEnterDate: dayjs().format(),
    }
    const p = { ...profile, pin: userPin }
    setProfile(p)
    await putUserProfile(p)
    setPin('')
    //console.log('saved pin')
    setIsLoading(false)

    onConfirm(userPin)
  }

  const handleSetPin = async (text: string) => {
    setError('')
    if (text.length === 4) {
      setPin(text)
      //console.log('pin: ', text)
    }
  }
  const handleSetConfirmPin = async (text: string) => {
    if (text.length === 4) {
      if (pin === text) {
        setError('')
        setIsLoading(true)
        await savePin()
      } else {
        setError('pins do not match')
      }
    }
  }

  return (
    <Box>
      <Dialog open={show} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title' sx={{ backgroundColor: CasinoBlueTransparent, color: 'white' }}>
          <Stack display='flex' direction={'row'}>
            <Stack flexGrow={1}>{'Create a pin'}</Stack>
            <Stack>
              <Button onClick={handleClose} sx={{ pl: 8 }}>
                <Close />
              </Button>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' sx={{ pt: 3 }} color='primary' variant='subtitle1'>
            The pin is designed to enhance security.
          </DialogContentText>
          <Box py={2}>
            <Typography>
              You will be asked to enter your pin occasionally to make sure your data is protected. Please try not to forget your pin! But if you do, you will
              need to reset it through an email confirmation... which is a hassle.
            </Typography>
          </Box>
          <Box py={2}>
            {pin.length < 4 && (
              <>
                <Box py={2}>
                  <CenterStack>
                    <Typography>pin</Typography>
                  </CenterStack>
                </Box>
                <CenterStack>
                  <Box>
                    <PinInput onConfirmed={handleSetPin} setFocus />
                  </Box>
                </CenterStack>
              </>
            )}
            {pin.length === 4 && (
              <>
                <Box py={2}>
                  <CenterStack>
                    <Typography>confirm pin</Typography>
                  </CenterStack>
                </Box>
                <CenterStack>
                  <Box>
                    <PinInput onConfirmed={handleSetConfirmPin} setFocus />
                  </Box>
                </CenterStack>
              </>
            )}
            <Box height={100} pb={2}>
              {error.length > 0 && (
                <Box py={2}>
                  <CenterStack>
                    <Alert severity='error'>{error}</Alert>
                  </CenterStack>
                </Box>
              )}
              {isLoading && <WarmupBox text='setting pin...' />}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default CreatePinDialog
