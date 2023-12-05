import { Alert, Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { useUserController } from 'hooks/userController'
import { processAlertTriggers } from 'lib/backend/alerts/stockAlertProcessor'
import { EmailMessage, LambdaDynamoRequest, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructStockAlertsSubSecondaryKey } from 'lib/backend/api/aws/util'
import { StockAlertSubscription, StockAlertSubscriptionWithMessage, StockAlertTrigger } from 'lib/backend/api/models/zModels'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { userHasRole } from 'lib/backend/auth/userUtil'
import { putRecordsBatch, searchRecords, sendEmailFromClient } from 'lib/backend/csr/nextApiWrapper'
import { formatEmail } from 'lib/ui/mailUtil'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import useSWR, { mutate } from 'swr'
import StockAlertRow from './StockAlertRow'

const StockAlertsLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const alertsSearchhKey = constructStockAlertsSubSecondaryKey(userProfile.username)
  const { ticket } = useUserController()
  const isAdmin = ticket !== null && userHasRole('Admin', ticket.roles)
  const fetcherFn = async (url: string, key: string) => {
    const response = sortArray(await searchRecords(alertsSearchhKey), ['last_modified'], ['desc'])
    const subs = response.map((m) => JSON.parse(m.data) as StockAlertSubscription)

    const model: StockAlertSubscriptionWithMessage = {
      subscriptions: sortArray(subs, ['lastTriggerExecuteDate'], ['desc']),
    }
    return model
  }

  const { data, isLoading, isValidating } = useSWR(alertsSearchhKey, ([url, key]) => fetcherFn(url, key))
  const [htmlMessage, setHtmlMessage] = React.useState<string | null>(null)
  const [successMesssage, setSuccessMessage] = React.useState<string | null>(null)

  const handleGenerateAlerts = async () => {
    setIsGenerating(true)
    setHtmlMessage(null)
    setSuccessMessage(null)

    const quotes = await getStockQuotes(data!.subscriptions.map((m) => m.symbol))
    const template = await formatEmail('/emailTemplates/stockAlertSubscriptionEmailTemplate.html', new Map<string, string>())
    const result = processAlertTriggers(data!, quotes, template)
    result.subscriptions = sortArray(result.subscriptions, ['lastTriggerExecuteDate'], ['desc'])

    //console.log('result.subscriptions: ', result.subscriptions)

    const records: LambdaDynamoRequest[] = result.subscriptions.map((m) => {
      return {
        id: m.id,
        category: alertsSearchhKey,
        data: m,
        expiration: 0,
      }
    })

    await putRecordsBatch({ records: records })
    const newItems = result.subscriptions.flatMap((s) => s.triggers).filter((f) => f.status === 'complete')
    setIsGenerating(false)
    mutate(alertsSearchhKey, result)
    if (newItems.length > 0) {
      setHtmlMessage(result.message ?? null)
    }
    setSuccessMessage(`generated ${newItems.length} messages`)
  }
  const handleSendEmail = async () => {
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
              {htmlMessage && <PrimaryButton text='send email' onClick={handleSendEmail} />}
            </Box>
          )}
          {/* {isAdmin && htmlMessage && <HtmlView html={htmlMessage} />} */}
          <Table>
            <TableHead></TableHead>
            <TableBody>
              {data &&
                data.subscriptions.map((sub) => (
                  <StockAlertRow key={sub.id} sub={sub} />
                  // <TableRow key={sub.id}>
                  //   <TableCell colSpan={10}>
                  //     <Box>
                  //       <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  //         <Box>
                  //           <Typography variant='h5'>{`${sub.company} (${sub.symbol})`}</Typography>
                  //         </Box>
                  //         <Box>
                  //           <ContextMenu items={menuItems}  />
                  //         </Box>
                  //       </Box>
                  //       {sub.triggers.map((trigger) => (
                  //         <Box key={trigger.typeId} pt={1} display={'flex'} gap={1} flexDirection={'column'}>
                  //           <Box>
                  //             <Typography variant='body2'>{`${trigger.typeDescription}`}</Typography>
                  //           </Box>
                  //           <Box>
                  //             <Typography variant='body2'>{`target: ${trigger.target}%`}</Typography>
                  //           </Box>
                  //           <Box>{trigger.message && <Alert severity='success'>{`${trigger.message}`}</Alert>}</Box>
                  //         </Box>
                  //       ))}
                  //     </Box>
                  //   </TableCell>
                  // </TableRow>
                ))}
            </TableBody>
          </Table>
        </>
      )}
      {successMesssage && <SnackbarSuccess show={true} text={successMesssage} duration={3000} />}
    </Box>
  )
}

export default StockAlertsLayout
