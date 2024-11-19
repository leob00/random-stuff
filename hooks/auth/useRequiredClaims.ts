import { Claim } from 'lib/backend/auth/userUtil'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { useState } from 'react'

export default function useRequiredClaims(userClaims: Claim[]) {
  const { claims, saveClaims } = useSessionStore()
  const [isValidating, setIsValidating] = useState(true)
  const [validatedClaims, setValidatedClaims] = useState<Claim | undefined>(claims.find((m) => m.type === 'rs-admin'))
}
