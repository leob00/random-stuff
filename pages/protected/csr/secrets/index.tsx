import { Alert, Box, Snackbar } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import CreatePinDialog from 'components/Organizms/Login/CreatePinDialog'
import SecretsLayout from 'components/Organizms/user/secrets/SecretsLayout'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { useUserController } from 'hooks/userController'
import { UserPin } from 'lib/backend/api/aws/models/apiGatewayModels'
import { useEffect, useState } from 'react'

const Page = () => {
  const { authProfile, ticket, setProfile, fetchProfilePassive } = useUserController()
  // const {userProfile} = useProfileValidator()
  const [loading, setLoading] = useState(true)
  const [showCreatePin, setShowCreatePin] = useState(false)
  const [showCreatePinAlert, setShowCreatePinAlert] = useState(false)

  const handlePinSaved = (pin: UserPin) => {
    setShowCreatePin(false)
    if (authProfile) {
      const p = { ...authProfile, pin: pin }
      setProfile(p)
      setShowCreatePinAlert(true)
    }
  }
  const handleCloseCreatePinAlert = () => {
    setShowCreatePinAlert(false)
  }

  useEffect(() => {
    const fn = async () => {
      let profile = authProfile ?? null
      if (!profile) {
        profile = await fetchProfilePassive()
        setProfile(profile)
      }
      if (profile && !profile?.pin) {
        setShowCreatePin(true)
      }
      setLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile])

  return (
    <>
      <>
        <ResponsiveContainer>
          <PageHeader text={'Secrets'} />
          {loading && <BackdropLoader />}
          <>
            {authProfile && ticket ? (
              <>
                {showCreatePin ? (
                  <CreatePinDialog show={showCreatePin} userProfile={authProfile} onConfirm={handlePinSaved} onCancel={() => setShowCreatePin(false)} />
                ) : (
                  <>
                    {authProfile.pin && (
                      <Box py={2}>
                        <SecretsLayout userProfile={authProfile} />
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
              <>{!loading && <PleaseLogin />}</>
            )}
          </>
        </ResponsiveContainer>
      </>
    </>
  )
}

export default Page
