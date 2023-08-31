import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import LoginUsernameForm, { UsernameLogin } from 'components/Molecules/Forms/Login/LoginUsernameForm'
import { useSessionPersistentSore, useSessionStore } from 'lib/backend/store/useSessionStore'
import { Claim, QlnUser } from 'lib/backend/auth/userUtil'
import { replaceItemInArray } from 'lib/util/collections'

const QlnUsernameLoginForm = ({ onSuccess }: { onSuccess: (claims: Claim[]) => void }) => {
  const [loginError, setLoginError] = React.useState<string | undefined>(undefined)
  const [showLoginSuccess, setShowLoginSuccess] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const config = apiConnection().qln
  const { claims, saveClaims } = useSessionPersistentSore()

  const handleSubmitLogin = async (data: UsernameLogin) => {
    setIsLoading(true)
    setShowLoginSuccess(false)
    setLoginError(undefined)
    const url = `${config.url}/AuthenticateUsernamePassword`
    const response = (await get(url, data)) as QlnApiResponse
    if (response.Errors.length === 0) {
      const body: QlnUser | null = response.Body
      if (body) {
        const newClaims = [...claims]
        const claim = newClaims.find((m) => m.type === 'qln')
        if (claim) {
          replaceItemInArray(claim, newClaims, 'type', 'qln')
        } else {
          newClaims.push({
            type: 'qln',
            token: body.Token,
            tokenExpirationDate: body.TokenExpirationDate,
          })
        }
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
