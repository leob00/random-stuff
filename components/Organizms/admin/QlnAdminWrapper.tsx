'use client'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import useQlnAdmin from 'hooks/auth/useQlnAdmin'
import { Claim } from 'lib/backend/auth/userUtil'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const QlnAdminWrapper = ({ onValidated }: { onValidated: () => void }) => {
  const router = useRouter()
  const { claim: adminClaim, isValidating } = useQlnAdmin()
  const { saveClaims } = useSessionStore()
  const handleQlnLogin = (claims: Claim[]) => {
    saveClaims(claims)
    onValidated()
  }

  const handleClose = () => {
    router.back()
  }

  useEffect(() => {
    if (isValidating) {
      return
    }
    if (!isValidating && !!adminClaim) {
      onValidated()
    }
  }, [])

  return (
    <>
      {isValidating && <ComponentLoader />}
      {!isValidating && adminClaim ? (
        <></>
      ) : (
        <>
          <QlnUsernameLoginForm onSuccess={handleQlnLogin} onClose={handleClose} />
        </>
      )}
    </>
  )
}

export default QlnAdminWrapper
