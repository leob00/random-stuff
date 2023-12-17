import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { Claim, ClaimType, getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import { useSessionPersistentStore } from 'lib/backend/store/useSessionStore'
import React, { ReactNode } from 'react'

const RequireClaim = ({ claimType, children }: { claimType: ClaimType; children: ReactNode }) => {
  const { claims, saveClaims } = useSessionPersistentStore()
  const { authProfile, fetchProfilePassive, setProfile } = useUserController()

  const [isValidating, setIsValidating] = React.useState(true)
  const [validatedClaim, setValidatedClaim] = React.useState(claims.find((m) => m.type === claimType))

  React.useEffect(() => {
    const fn = async () => {
      const allClaims = [...claims]
      let claim = { ...validatedClaim }
      const now = dayjs()
      const expirationSeconds = dayjs(now).diff(now.add(30, 'days'), 'second')
      if (!claim.token) {
        switch (claimType) {
          case 'rs': {
            if (!authProfile) {
              const p = await fetchProfilePassive(60000)
              if (p) {
                const newClaim: Claim = {
                  token: crypto.randomUUID(),
                  type: 'rs',
                  tokenExpirationSeconds: expirationSeconds,
                }
                setProfile(p)
                allClaims.push(newClaim)
                saveClaims(allClaims)
                setValidatedClaim(newClaim)
              }
            } else {
              const newClaim: Claim = {
                token: crypto.randomUUID(),
                type: 'rs',
                tokenExpirationSeconds: expirationSeconds,
              }
              allClaims.push(newClaim)
              saveClaims(allClaims)
              setValidatedClaim(newClaim)
            }
            break
          }
          case 'qln': {
            break
          }
        }
      } else {
        if (claimType === 'qln') {
          if (dayjs().isAfter(claim.tokenExpirationDate!)) {
            setValidatedClaim(undefined)
          }
        }
      }

      setIsValidating(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validatedClaim])

  const RenderChallenge = () => {
    const handleQlnLogin = (userClaims: Claim[]) => {
      saveClaims(userClaims)
      setValidatedClaim(userClaims.find((m) => m.type === 'qln'))
    }
    switch (claimType) {
      case 'rs':
        return (
          <>
            <PleaseLogin message='Please login to use this feature' />
          </>
        )
      case 'qln':
        return <QlnUsernameLoginForm onSuccess={handleQlnLogin} />
      case 'rs-admin':
        return (
          <Box>
            <PleaseLogin message='Please login to use this feature' />
          </Box>
        )
    }
    return <></>
  }

  return (
    <>
      {isValidating && <BackdropLoader />}
      {!isValidating && <>{validatedClaim ? <>{children}</> : RenderChallenge()}</>}
    </>
  )
}

export default RequireClaim
