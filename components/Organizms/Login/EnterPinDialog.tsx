import Close from '@mui/icons-material/Close'
import { Box, Dialog, DialogTitle, Stack, Button, DialogContent, DialogContentText, Typography, Alert } from '@mui/material'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import CenterStack from 'components/Atoms/CenterStack'
import PinInput from 'components/Atoms/Inputs/PinInput'
import WarmupBox from 'components/Atoms/WarmupBox'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { UserPin, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import React from 'react'
import router from 'next/router'
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

  const handleClose = async () => {
    onCancel()
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
      } else {
        setError('incorrect pin')
        setIsLoading(false)
      }
    } else {
      setError('pin is invalid')
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    setError('')
  }, [])

  return (
    <Box>
      {show ? (
        <Dialog open={show} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
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
                <Typography component={'div'}>{`You will be asked to enter your pin periodically to make sure your account is protected.`}</Typography>
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
              <Box display={'flex'} gap={2} justifyContent={'center'}>
                <Box>
                  <InternalLink text='forgot pin' route={`/protected/csr/profile/forgotPin?id=${router.asPath}`}></InternalLink>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      ) : (
        <></>
      )}
    </Box>
  )
}

export default EnterPinDialog
