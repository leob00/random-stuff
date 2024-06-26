import { Alert, Box, Snackbar } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import CreatePinDialog from 'components/Organizms/Login/CreatePinDialog'
import SecretsLayout from 'components/Organizms/user/secrets/SecretsLayout'
import { useUserController } from 'hooks/userController'
import { UserPin } from 'lib/backend/api/aws/models/apiGatewayModels'
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
      const p = await userController.fetchProfilePassive()
      setProfile(p)
      if (p !== null && !p.pin) {
        setShowCreatePin(true)
      }
      setProfile(p)
      setLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController.ticket])

  return (
    <>
      <>
        <ResponsiveContainer>
          <PageHeader text={'Secrets'} />
          {loading ? (
            <BackdropLoader />
          ) : (
            <>
              {profile && ticket ? (
                <>
                  {showCreatePin ? (
                    <CreatePinDialog show={showCreatePin} userProfile={profile} onConfirm={handlePinSaved} onCancel={() => setShowCreatePin(false)} />
                  ) : (
                    <>
                      {profile.pin && (
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
              ) : (
                <>
                  <PleaseLogin />
                </>
              )}
            </>
          )}
        </ResponsiveContainer>
      </>
    </>
  )
}

export default Page
