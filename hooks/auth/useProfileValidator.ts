import { useUserController } from 'hooks/userController'
import { useEffect, useState } from 'react'

export const useProfileValidator = () => {
  const { authProfile, fetchProfilePassive, setProfile } = useUserController()
  const [isValidating, setIsValidating] = useState(true)

  const validate = async () => {
    if (!authProfile) {
      setIsValidating(true)
      const p = await fetchProfilePassive()
      await setProfile(p)
    }
    setIsValidating(false)
  }

  useEffect(() => {
    validate()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile])

  return {
    isValidating,
    userProfile: authProfile,
  }
}
