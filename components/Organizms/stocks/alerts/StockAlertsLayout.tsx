import { Alert, Box, Table, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useUserController } from 'hooks/userController'
import { processAlertTriggers } from 'lib/backend/alerts/stockAlertProcessor'
import { EmailMessage, LambdaDynamoRequest, LambdaDynamoRequestBatch, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructStockAlertsSubSecondaryKey } from 'lib/backend/api/aws/util'
import { post } from 'lib/backend/api/fetchFunctions'
import { StockAlertSubscription, StockAlertSubscriptionWithMessage, StockAlertTrigger, StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuotes, SymbolCompany } from 'lib/backend/api/qln/qlnApi'
import { userHasRole } from 'lib/backend/auth/userUtil'
import { putRecordsBatch, searchRecords, sendEmailFromClient } from 'lib/backend/csr/nextApiWrapper'
import { formatEmail } from 'lib/ui/mailUtil'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import useSWR, { mutate } from 'swr'

const StockAlertsLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const alertsSearchhKey = constructStockAlertsSubSecondaryKey(userProfile.username)
  const { ticket } = useUserController()
  const isAdmin = ticket !== null && userHasRole('Admin', ticket.roles)
  const fetcherFn = async (url: string, key: string) => {
    const response = sortArray(await searchRecords(alertsSearchhKey), ['last_modified'], ['desc'])
    const subs = response.map((m) => JSON.parse(m.data) as StockAlertSubscription)

    const result = sortArray(subs, ['symbol'], ['asc'])
    const model: StockAlertSubscriptionWithMessage = {
      subscriptions: result,
    }
    return model
  }

  const { data, isLoading, isValidating } = useSWR(alertsSearchhKey, ([url, key]) => fetcherFn(url, key))
  const showSend = data ? data.subscriptions.flatMap((s) => s.triggers).filter((m) => m.status === 'complete').length > 0 : false
  const [htmlMessage, setHtmlMessage] = React.useState<string | undefined>(undefined)

  const handleGenerateAlerts = async () => {
    setIsGenerating(true)
    const quotes = await getStockQuotes(data!.subscriptions.map((m) => m.symbol))
    const template = await formatEmail('/emailTemplates/stockAlertSubscriptionEmailTemplate.html', new Map<string, string>())
    const result = processAlertTriggers(data!, quotes, template)
    const records: LambdaDynamoRequest[] = result.subscriptions.map((m) => {
      return {
        id: m.id,
        category: alertsSearchhKey,
        data: m,
        expiration: 0,
      }
    })
    await putRecordsBatch({ records: records })
    setHtmlMessage(result.message)
    setIsGenerating(false)
    mutate(alertsSearchhKey, result)
  }
  const handleSendEmail = async () => {
    //console.log(resultHtml)
    if (htmlMessage) {
      const postData: EmailMessage = {
        to: userProfile.username,
        subject: 'Random Stuff - Stock Alerts',
        html: htmlMessage,
      }
      setIsGenerating(true)
      await sendEmailFromClient(postData)
      setIsGenerating(false)
    }
  }

  return (
    <Box py={2}>
      <PageHeader text='Alerts' backButtonRoute='/csr/stocks' />
      {isLoading && <BackdropLoader />}
      {isValidating && <BackdropLoader />}
      {isGenerating && <BackdropLoader />}
      {data && (
        <>
          {isAdmin && (
            <Box py={2} display={'flex'} justifyContent={'space-between'}>
              <PrimaryButton text='generate alerts' onClick={handleGenerateAlerts} />
              {showSend && <PrimaryButton text='send email' onClick={handleSendEmail} />}
            </Box>
          )}
          <Table>
            <TableHead>
              {data &&
                data.subscriptions.map((sub) => (
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
                            <Box>{trigger.message && <Alert severity='success'>{`${trigger.message}`}</Alert>}</Box>
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
