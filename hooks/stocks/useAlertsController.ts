import { useUserController } from 'hooks/userController'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockAlertSubscription, StockAlertSubscriptionWithMessage } from 'lib/backend/api/models/zModels'
import { userHasRole } from 'lib/backend/auth/userUtil'
import { searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import { Dispatch, SetStateAction, useState } from 'react'
import useSWR, { mutate } from 'swr'

export const useAlertsController = <T>(alertsSearchhKey: string, fetcherFunction: () => Promise<T>) => {
  const { ticket } = useUserController()
  const isAdmin = ticket !== null && userHasRole('Admin', ticket.roles)
  const { data, mutate, isLoading } = useSwrHelper(alertsSearchhKey, fetcherFunction)

  //const { data, isLoading, isValidating } = useSWR(alertsSearchhKey, ([url, key]) => fetcherFunction(url, key))

  const [isMutating, setIsMutating] = React.useState(false)
  const loading = isLoading || isMutating

  return {
    data: data,
    isLoading: loading,
    isAdmin: isAdmin,
    mutate,
    setIsLoading: setIsMutating,
  }
}
