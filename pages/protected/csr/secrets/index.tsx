import { Alert, Box, Snackbar, Typography } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredParagraph from 'components/Atoms/Text/CenteredParagraph'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import CreatePinDialog from 'components/Organizms/Login/CreatePinDialog'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import RequireUserProfile from 'components/Organizms/user/RequireUserProfile'
import SecretsLayout from 'components/Organizms/user/secrets/SecretsLayout'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { AmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import React from 'react'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [ticket, setTicket] = React.useState<AmplifyUser | null>(null)
  const [showCreatePin, setShowCreatePin] = React.useState(false)
  const [profile, setProfile] = React.useState(userController.authProfile)
  const [showCreatePinAlert, setShowCreatePinAlert] = React.useState(false)

  const handlePinSaved = (pin: UserPin) => {
    setShowCreatePin(false)
    if (profile) {
      const p = { ...profile, pin: pin }
      setProfile(p)
      userController.setProfile(p)
      setShowCreatePinAlert(true)
    }
  }
  const handleCloseCreatePinAlert = () => {
    setShowCreatePinAlert(false)
  }

  React.useEffect(() => {
    const fn = async () => {
      const user = await getUserCSR()
      setTicket(user)
      const p = await userController.refetchProfile()
      setProfile(p)
      if (p !== null && !p.pin) {
        setShowCreatePin(true)
      }
      setProfile(p)
      setLoading(false)
    }
    fn()
  }, [userController.username])

  return (
    <>
      <NonSSRWrapper>
        {loading ? (
          <WarmupBox />
        ) : profile && ticket ? (
          <>
            <>
              <CenteredTitle title='Secrets Manager' />
              {showCreatePin ? (
                <CreatePinDialog show={showCreatePin} userProfile={profile} onConfirm={handlePinSaved} onCancel={() => setShowCreatePin(false)} />
              ) : (
                <>
                  {!profile.pin ? (
                    <Box>
                      <CenterStack>
                        <Typography>
                          You will be asked to enter your pin occasionally to make sure your secrets are protected. Please try not to forget your pin! But if
                          you do, you will need to reset it through an email confirmation... which is a hassle....
                        </Typography>
                      </CenterStack>
                      <CenterStack>
                        <Box py={2}>
                          <SecondaryButton text='Create a pin' onClick={() => setShowCreatePin(true)} width={200} />
                        </Box>
                      </CenterStack>
                    </Box>
                  ) : (
                    <Box py={2}>
                      <SecretsLayout user={ticket} />
                    </Box>
                  )}

                  <Snackbar
                    open={showCreatePinAlert}
                    autoHideDuration={3000}
                    onClose={handleCloseCreatePinAlert}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  >
                    <Alert onClose={handleCloseCreatePinAlert} severity='success' sx={{ width: '100%' }}>
                      Login succeeded. Thank you!
                    </Alert>
                  </Snackbar>
                </>
              )}
            </>
          </>
        ) : (
          <PleaseLogin />
        )}
      </NonSSRWrapper>
    </>
  )
}

export default Page
