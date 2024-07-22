import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { Claim, ClaimType } from 'lib/backend/auth/userUtil'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import React from 'react'

export const useClaimManager = (claimType: ClaimType) => {
  const { claims, saveClaims } = useSessionStore()
  const claim = claims.find((m) => m.type === claimType)
  const { authProfile, fetchProfilePassive, setProfile } = useUserController()

  const [isValidating, setIsValidating] = React.useState(true)
  const [validatedClaim, setValidatedClaim] = React.useState(claim)

  const validateClaim = async () => {
    const allClaims = [...claims]
    const now = dayjs()
    const expirationSeconds = dayjs(now).diff(now.add(30, 'days'), 'second')

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
        if (!validatedClaim?.token) {
          setValidatedClaim(undefined)
          break
        }
        if (!validatedClaim?.tokenExpirationDate) {
          setValidatedClaim(undefined)
          break
        }
        if (dayjs().isAfter(validatedClaim.tokenExpirationDate)) {
          setValidatedClaim(undefined)
          break
        }
        break
      }
    }

    setIsValidating(false)
  }

  React.useEffect(() => {
    validateClaim()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validatedClaim])

  return {
    isValidating,
    validatedClaim,
    setValidatedClaim,
    saveClaims,
  }
}
