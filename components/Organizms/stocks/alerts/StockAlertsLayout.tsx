import { Box, Table, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructStockAlertsSubSecondaryKey } from 'lib/backend/api/aws/util'
import { StockAlertSubscription, StockAlertTrigger } from 'lib/backend/api/models/zModels'
import { SymbolCompany } from 'lib/backend/api/qln/qlnApi'
import { userHasRole } from 'lib/backend/auth/userUtil'
import { searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import useSWR, { mutate } from 'swr'

interface Subscription {
  id: string
  symbol: string
}

interface Model {
  subscriptions: Subscription[]
  triggers: StockAlertTrigger[]
}

const StockAlertsLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const alertsSearchKey = constructStockAlertsSubSecondaryKey(userProfile.username)
  const { ticket } = useUserController()
  const isAdmin = ticket !== null && userHasRole('Admin', ticket.roles)
  const fetcherFn = async (url: string, key: string) => {
    const response = sortArray(await searchRecords(alertsSearchKey), ['last_modified'], ['desc'])
    const subs = response.map((m) => JSON.parse(m.data) as StockAlertSubscription)
    const result = sortArray(subs, ['symbol'], ['asc'])
    const subsriptions: Subscription[] = result.map((m) => {
      return {
        id: m.id,
        symbol: m.symbol,
      }
    })
    const triggers = result.flatMap((m) => m.triggers.filter((f) => f.enabled))
    const model: Model = {
      subscriptions: subsriptions,
      triggers: triggers,
    }

    return result
  }

  const { data, isLoading, isValidating } = useSWR(alertsSearchKey, ([url, key]) => fetcherFn(url, key))
  return (
    <Box py={2}>
      <PageHeader text='Alerts' />

      {isLoading && <BackdropLoader />}

      {data && (
        <>
          {isAdmin && (
            <>
              <PrimaryButton text='generate alerts' />
            </>
          )}
          <Table>
            <TableHead>
              {data.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell colSpan={10}>
                    <Box>
                      <Box pb={1}>
                        <Typography variant='h5'>{`${sub.company} (${sub.symbol})`}</Typography>
                      </Box>
                      {sub.triggers.map((trigger) => (
                        <Box key={trigger.typeId} pt={1} display={'flex'} gap={1} flexDirection={'column'}>
                          <Box>
                            <Typography variant='body2'>{`${trigger.typeDescription}`}</Typography>
                          </Box>
                          <Box>
                            <Typography variant='body2'>{`target: ${trigger.target}%`}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableHead>
          </Table>

          {/* <JsonView obj={data} /> */}
        </>
      )}
    </Box>
  )
}

export default StockAlertsLayout
