import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import LoginUsernameForm, { UsernameLogin } from 'components/Molecules/Forms/Login/LoginUsernameForm'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { Claim, QlnUser } from 'lib/backend/auth/userUtil'
import dayjs from 'dayjs'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import { useRouter } from 'next/router'

const QlnUsernameLoginForm = ({ onSuccess }: { onSuccess: (claims: Claim[]) => void }) => {
  const [loginError, setLoginError] = React.useState<string | undefined>(undefined)
  const [showLoginSuccess, setShowLoginSuccess] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const config = apiConnection().qln
  const { claims, saveClaims } = useSessionStore()
  const router = useRouter()

  const handleSubmitLogin = async (data: UsernameLogin) => {
    setIsLoading(true)
    setShowLoginSuccess(false)
    setLoginError(undefined)
    const url = `${config.url}/AuthenticateUsernamePassword`
    const response = (await get(url, data)) as QlnApiResponse
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
        <LoginUsernameForm obj={{ username: '', password: '' }} onSubmitted={handleSubmitLogin} title={'Admin Login'} error={loginError} />
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
