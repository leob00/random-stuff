import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import LoginUsernameForm, { UsernameLogin } from 'components/Molecules/Forms/Login/LoginUsernameForm'
import { useSessionPersistentStore, useSessionStore } from 'lib/backend/store/useSessionStore'
import { Claim, QlnUser } from 'lib/backend/auth/userUtil'
import { replaceItemInArray } from 'lib/util/collections'
import dayjs from 'dayjs'

const QlnUsernameLoginForm = ({ onSuccess }: { onSuccess: (claims: Claim[]) => void }) => {
  const [loginError, setLoginError] = React.useState<string | undefined>(undefined)
  const [showLoginSuccess, setShowLoginSuccess] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const config = apiConnection().qln
  const { claims, saveClaims } = useSessionPersistentStore()

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
          tokenExpirationDate: dayjs().add(body.TokenExpirationSeconds, 'seconds').format(),
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
      <LoginUsernameForm obj={{ username: '', password: '' }} onSubmitted={handleSubmitLogin} title={'QLN Login'} error={loginError} />
      {showLoginSuccess && (
        <>
          <SnackbarSuccess show={showLoginSuccess} text={'Login Successful'} />
        </>
      )}
    </>
  )
}
export default QlnUsernameLoginForm