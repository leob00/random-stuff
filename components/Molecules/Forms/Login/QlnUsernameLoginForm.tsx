import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import LoginUsernameForm, { UsernameLogin } from 'components/Molecules/Forms/Login/LoginUsernameForm'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { Claim, QlnUser } from 'lib/backend/auth/userUtil'
import dayjs from 'dayjs'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import { useState } from 'react'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const QlnUsernameLoginForm = ({ onSuccess, onClose }: { onSuccess: (claims: Claim[]) => void; onClose?: () => void }) => {
  const [loginError, setLoginError] = useState<string | undefined>(undefined)
  const [showLoginSuccess, setShowLoginSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { claims, saveClaims } = useSessionStore()

  const handleSubmitLogin = async (data: UsernameLogin) => {
    setIsLoading(true)
    setShowLoginSuccess(false)
    setLoginError(undefined)
    const endpoint = `/AuthenticateUsernamePassword?username=${data.username}&password=${data.password}`
    const response = await serverGetFetch(endpoint)
    if (response.Errors.length === 0) {
      const body: QlnUser | null = response.Body
      if (body) {
        const newClaims = [...claims].filter((m) => m.type !== 'qln')
        newClaims.push({
          type: 'qln',
          token: body.Token,
          tokenExpirationDate: dayjs()
            .add(body.TokenExpirationSeconds - 300, 'seconds')
            .format(),
          tokenExpirationSeconds: body.TokenExpirationSeconds,
        })

        saveClaims(newClaims)
        onSuccess(newClaims)
        setShowLoginSuccess(true)
      } else {
        setShowLoginSuccess(false)
      }
    } else {
      setLoginError(response.Errors[0].Message)
    }
    setIsLoading(false)
  }
  return (
    <>
      {isLoading && <ComponentLoader />}
      <FormDialog
        show={!showLoginSuccess}
        title={'Log in'}
        onCancel={() => {
          onClose?.()
        }}
      >
        <LoginUsernameForm onSubmitted={handleSubmitLogin} title={'Admin Login'} error={loginError} isLoading={isLoading} />
      </FormDialog>
      {showLoginSuccess && (
        <>
          <SnackbarSuccess show={showLoginSuccess} text={'Login Successful'} onClose={() => setShowLoginSuccess(false)} />
        </>
      )}
    </>
  )
}
export default QlnUsernameLoginForm
