import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { Claim, ClaimType, getUserCSR } from 'lib/backend/auth/userUtil'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { useEffect, useState } from 'react'
import { mapRolesToClaims } from './authHelper'

export default function useQlnAdmin() {
  const { claims, saveClaims } = useSessionStore()
  const [isValidating, setIsValidating] = useState(true)
  const [validatedClaim, setValidatedClaim] = useState<Claim | undefined>(claims.find((m) => m.type === 'qln'))
  const { ticket, setTicket } = useUserController()

  const validateClaim = async (claimType: ClaimType) => {
    let newClaims = [...claims]
    if (newClaims.length === 0) {
      if (ticket) {
        newClaims = mapRolesToClaims(ticket.roles)
        saveClaims(newClaims)
      }
    }
    if (!validatedClaim) {
      const claim = claims.find((m) => m.type === claimType)
      if (claim) {
        if (dayjs().isBefore(claim.tokenExpirationDate!)) {
          setValidatedClaim(claim)
        } else {
          setValidatedClaim(undefined)
        }
      } else {
        setValidatedClaim(undefined)
      }
    }
    setIsValidating(false)
  }

  useEffect(() => {
    const fn = async () => {
      validateClaim('qln')
    }
    fn()
  }, [ticket, claims])

  return {
    isValidating,
    claim: validatedClaim,
  }
}
