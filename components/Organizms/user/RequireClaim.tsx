'use client'
import { Box } from '@mui/material'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import dayjs from 'dayjs'
import { mapRolesToClaims } from 'hooks/auth/authHelper'
import useQlnAdmin from 'hooks/auth/useQlnAdmin'
import { useUserController } from 'hooks/userController'
import { Claim, ClaimType, getUserCSR } from 'lib/backend/auth/userUtil'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { getUtcNow } from 'lib/util/dateUtil'
import { ReactNode, useEffect, useState } from 'react'

const RequireClaim = ({ claimType, children }: { claimType: ClaimType; children: ReactNode }) => {
  const { claims, saveClaims } = useSessionStore()
  const { ticket } = useUserController()
  const { claim: adminClaim, isValidating: isValidatingAdminClaim } = useQlnAdmin()
  const [isValidating, setIsValidating] = useState(true)
  const [validatedClaim, setValidatedClaim] = useState(claims.find((m) => m.type === claimType))

  const handleLoginQln = (newClaims: Claim[]) => {
    const qlnClaim = newClaims.find((m) => m.type === 'qln')
    if (qlnClaim) {
      appendClaim(qlnClaim)
      setValidatedClaim(newClaims.find((m) => m.type === claimType))
    }
  }

  const appendClaim = (c: Claim) => {
    const newClaims = claims.filter((m) => m.type !== c.type)
    newClaims.push(c)
    saveClaims(newClaims)
  }

  useEffect(() => {
    if (isValidatingAdminClaim) {
      return
    }
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
      } else {
        switch (claimType) {
          case 'rs': {
            const guest = ticket?.roles?.find((m) => m.Name === 'Registered User')
            if (guest) {
              const newClaim: Claim = {
                token: crypto.randomUUID(),
                type: 'rs',
                tokenExpirationSeconds: expirationSeconds,
              }
              appendClaim(newClaim)
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
              if (!isValidatingAdminClaim && adminClaim) {
                allClaims.push(adminClaim)
              }
              allClaims.push(newClaim)
              saveClaims(allClaims)
              setValidatedClaim(newClaim)
            }
            break
          }
          case 'qln':
            if (adminClaim && !isValidatingAdminClaim) {
              appendClaim(adminClaim)
              setValidatedClaim(adminClaim)
            }
        }
      }

      setIsValidating(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validatedClaim, adminClaim, isValidatingAdminClaim])

  const RenderChallenge = () => {
    switch (claimType) {
      case 'rs':
        return <PleaseLogin />
      case 'rs-admin':
        return (
          <>
            {!isValidatingAdminClaim && !adminClaim ? (
              <QlnUsernameLoginForm onSuccess={handleLoginQln} />
            ) : (
              <Box>
                <PleaseLogin />
              </Box>
            )}
          </>
        )
      case 'qln':
        return <>{!isValidatingAdminClaim && !adminClaim && <QlnUsernameLoginForm onSuccess={handleLoginQln} />}</>
    }

    return <></>
  }

  return (
    <>
      {isValidating && <ComponentLoader />}
      {!isValidating && <>{validatedClaim ? <>{children}</> : RenderChallenge()}</>}
    </>
  )
}

export default RequireClaim
