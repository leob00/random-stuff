import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import dayjs from 'dayjs'
import { mapRolesToClaims } from 'hooks/auth/authHelper'
import { useUserController } from 'hooks/userController'
import { Claim, ClaimType, getUserCSR } from 'lib/backend/auth/userUtil'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { getUtcNow } from 'lib/util/dateUtil'
import { ReactNode, useEffect, useState } from 'react'

const RequireClaim = ({ claimType, children }: { claimType: ClaimType; children: ReactNode }) => {
  const { claims, saveClaims } = useSessionStore()
  const { ticket } = useUserController()
  const [isValidating, setIsValidating] = useState(true)
  const [validatedClaim, setValidatedClaim] = useState(claims.find((m) => m.type === claimType))

  useEffect(() => {
    const fn = async () => {
      if (validatedClaim) {
        setIsValidating(false)
        return
      }
      const allClaims = [...claims]
      const now = getUtcNow()
      const expirationSeconds = dayjs(now).diff(now.add(30, 'days'), 'second')

      let userTicket = ticket
      if (!userTicket) {
        setIsValidating(true)
        userTicket = await getUserCSR()
      }
      if (!userTicket) {
        setIsValidating(false)
        setValidatedClaim(undefined)
        return
      }
      const newClaims = mapRolesToClaims(userTicket.roles)
      const newCl = newClaims.find((m) => m.type === claimType)
      if (newCl) {
        setValidatedClaim({ ...newCl, tokenExpirationSeconds: expirationSeconds })
        setIsValidating(false)
      } else {
        if (validatedClaim && !validatedClaim.token) {
          switch (claimType) {
            case 'rs': {
              const guest = ticket?.roles?.find((m) => m.Name === 'Registered User')
              if (guest) {
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
            case 'rs-admin': {
              const admin = ticket?.roles?.find((m) => m.Name === 'Admin')
              if (admin) {
                const newClaim: Claim = {
                  token: crypto.randomUUID(),
                  type: 'rs-admin',
                  tokenExpirationSeconds: expirationSeconds,
                }
                allClaims.push(newClaim)
                saveClaims(allClaims)
                setValidatedClaim(newClaim)
              }
              break
            }
          }
        } else {
          if (claimType === 'qln') {
            if (validatedClaim) {
              if (dayjs().isAfter(validatedClaim.tokenExpirationDate!)) {
                setValidatedClaim(undefined)
              }
            }
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
        return <PleaseLogin message='Please sign in to use this feature' />
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
