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
  const { ticket } = useUserController()
  const [userTicket, setUserTicket] = useState(ticket)

  const validateClaim = async (claimType: ClaimType) => {
    let newClaims = [...claims]
    if (newClaims.length === 0) {
      if (userTicket) {
        newClaims = mapRolesToClaims(userTicket.roles)
        saveClaims(newClaims)
      }
    }
    if (!validatedClaim) {
      const claim = claims.find((m) => m.type === claimType)
      if (claim) {
        if (dayjs().isBefore(claim.tokenExpirationDate!)) {
          setValidatedClaim(claim)
        }
      }
    }
    setIsValidating(false)
  }

  useEffect(() => {
    const fn = async () => {
      if (!ticket) {
        const newTicket = await getUserCSR()
        setUserTicket(newTicket)
      }
      fn()
    }
  }, [ticket])

  useEffect(() => {
    if (userTicket) {
      validateClaim('qln')
    } else {
      setIsValidating(false)
    }
  }, [userTicket])

  return {
    isValidating,
    claim: validatedClaim,
  }
}
