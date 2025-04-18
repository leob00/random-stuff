import { useUserController } from 'hooks/userController'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { userHasRole } from 'lib/backend/auth/userUtil'
import { useState } from 'react'

export const useAlertsController = <T>(alertsSearchhKey: string, fetcherFunction: () => Promise<T>) => {
  const { ticket } = useUserController()
  const isAdmin = ticket !== null && userHasRole('Admin', ticket.roles)
  const { data, mutate, isLoading } = useSwrHelper(alertsSearchhKey, fetcherFunction, { revalidateOnFocus: false })

  const [isMutating, setIsMutating] = useState(false)
  const loading = isLoading || isMutating

  return {
    data: data,
    isLoading: loading,
    isAdmin: isAdmin,
    mutate,
    setIsLoading: setIsMutating,
  }
}
