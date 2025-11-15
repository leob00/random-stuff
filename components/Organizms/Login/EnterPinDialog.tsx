'use client'
import Close from '@mui/icons-material/Close'
import { Box, Dialog, DialogTitle, Stack, Button, DialogContent, DialogContentText, Typography, Alert } from '@mui/material'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import CenterStack from 'components/Atoms/CenterStack'
import PinInput from 'components/Atoms/Inputs/PinInput'
import WarmupBox from 'components/Atoms/WarmupBox'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { UserPin, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { validateUserPin } from 'lib/backend/csr/nextApiWrapper'
import { getUtcNow } from 'lib/util/dateUtil'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const asPath = usePathname()
  const handleClose = async () => {
    onCancel()
  }

  const handleSetPin = async (text: string) => {
    if (text.length === 4) {
      const isValid = await validateUserPin(text)
      if (isValid) {
        const updatedPin = { ...userProfile.pin!, lastEnterDate: getUtcNow().format() }
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

  useEffect(() => {
    setError('')
  }, [])

  return (
    <Box>
      {show ? (
        <Dialog open={show} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
          <DialogTitle id='alert-dialog-title' sx={{ backgroundColor: CasinoBlueTransparent, color: 'white' }}>
            <Stack display='flex' direction={'row'}>
              <Stack flexGrow={1}>{'Pin'}</Stack>
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
                <Typography component={'div'}>{`You will be asked to enter your pin periodically to make sure your data is protected.`}</Typography>
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
                  <InternalLink text='forgot pin' route={`/account/profile`} />
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
