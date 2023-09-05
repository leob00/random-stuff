import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import { Claim, ClaimType } from 'lib/backend/auth/userUtil'
import { useSessionPersistentStore } from 'lib/backend/store/useSessionStore'
import React, { ReactNode } from 'react'
const RequireClaim = ({ claimType, children }: { claimType: ClaimType; children: ReactNode }) => {
  const { claims, saveClaims } = useSessionPersistentStore()
  const { authProfile, fetchProfilePassive } = useUserController()

  const [isValidating, setIsValidating] = React.useState(true)
  const [validatedClaim, setValidatedClaim] = React.useState(claims.find((m) => m.type === claimType))

  React.useEffect(() => {
    const fn = async () => {
      if (validatedClaim) {
        setIsValidating(false)
        return
      }
      const allClaims = [...claims]
      let claim = allClaims.find((m) => m.type === claimType)
      switch (claimType) {
        case 'rs':
          {
            if (!claim) {
              if (!authProfile) {
                const p = await fetchProfilePassive(60000)
                if (p) {
                  const newClaim: Claim = {
                    token: crypto.randomUUID(),
                    type: 'rs',
                    tokenExpirationSeconds: 6400000,
                  }

                  allClaims.push(newClaim)
                  saveClaims(allClaims)
                  setValidatedClaim(newClaim)
                }
              }
            }
          }
          setIsValidating(false)
      }
    }
    fn()
  }, [claimType, validatedClaim])

  const RenderChallenge = () => {
    switch (claimType) {
      case 'rs':
        return <PleaseLogin message='Please login to use this feature' />
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
