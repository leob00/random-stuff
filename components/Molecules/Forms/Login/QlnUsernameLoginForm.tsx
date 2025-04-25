import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import LoginUsernameForm, { UsernameLogin } from 'components/Molecules/Forms/Login/LoginUsernameForm'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { Claim, QlnUser } from 'lib/backend/auth/userUtil'
import dayjs from 'dayjs'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import { useRouter } from 'next/router'
import { useState } from 'react'

const QlnUsernameLoginForm = ({ onSuccess }: { onSuccess: (claims: Claim[]) => void }) => {
  const [loginError, setLoginError] = useState<string | undefined>(undefined)
  const [showLoginSuccess, setShowLoginSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { claims, saveClaims } = useSessionStore()
  const router = useRouter()

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
      {isLoading && <BackdropLoader />}
      <FormDialog show={!showLoginSuccess} title={'Log in'} onCancel={() => router.push('/protected/csr/dashboard')}>
        <LoginUsernameForm onSubmitted={handleSubmitLogin} title={'Admin Login'} error={loginError} />
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
