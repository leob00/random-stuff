import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useAlertsController } from 'hooks/stocks/alerts/useAlertsController'
import { processAlertTriggers } from 'lib/backend/alerts/stockAlertProcessor'
import { DynamoKeys, EmailMessage, LambdaDynamoRequest, updateSubscriptions, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructStockAlertsSubPrimaryKey, constructStockAlertsSubSecondaryKey } from 'lib/backend/api/aws/util'
import { StockAlertSubscription, StockAlertSubscriptionWithMessage, StockAlertTrigger, StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { getRecord, putRecord, putRecordsBatch, searchRecords, sendEmailFromClient } from 'lib/backend/csr/nextApiWrapper'
import { getDefaultSubscription } from 'lib/ui/alerts/stockAlertHelper'
import { formatEmail } from 'lib/ui/mailUtil'
import { sortArray } from 'lib/util/collections'
import { uniq } from 'lodash'
import numeral from 'numeral'
import React from 'react'
import StocksLookup from '../StocksLookup'
import EmailPreview from './EmailPreview'
import StockAlertRow from './StockAlertRow'
import StockSubscriptionForm from './StockSubscriptionForm'
import { saveTrigger } from 'lib/ui/alerts/stockAlertHelper'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'

const StockAlertsLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const alertsSearchhKey = constructStockAlertsSubSecondaryKey(userProfile.username)
  const [searchFilter, setSearchFilter] = React.useState('')
  const [showAddAlert, setShowAddAlert] = React.useState(false)

  const filterRecords = (data: StockAlertSubscriptionWithMessage): StockAlertSubscriptionWithMessage => {
    const result = { ...data }
    if (searchFilter.length > 0) {
      result.subscriptions = result.subscriptions.filter(
        (m) => m.symbol.toLowerCase().startsWith(searchFilter.toLowerCase()) || m.company.toLowerCase().startsWith(searchFilter.toLowerCase()),
      )
    }
    return result
  }

  const dataFn = async () => {
    const response = await searchRecords(alertsSearchhKey)
    const subs = response.map((m) => JSON.parse(m.data) as StockAlertSubscription)
    const model: StockAlertSubscriptionWithMessage = {
      subscriptions: sortAlerts(subs),
    }
    return model
  }

  const { data, isLoading, isAdmin, mutate, setIsLoading } = useAlertsController<StockAlertSubscriptionWithMessage>(alertsSearchhKey, dataFn)
  const [emailMessage, setEmailMessage] = React.useState<EmailMessage | null>(null)
  const [successMesssage, setSuccessMessage] = React.useState<string | null>(null)
  const [quote, setQuote] = React.useState<StockQuote | null>(null)
  const [editSub, setEditSub] = React.useState<StockAlertSubscription | null>(null)

  const handleGenerateAlerts = async () => {
    setIsLoading(true)
    setEmailMessage(null)
    setSuccessMessage(null)
    setSearchFilter('')
    setQuote(null)
    setShowAddAlert(false)
    const dataCopy = { ...data! }
    const quotes = await getStockQuotes(uniq(dataCopy.subscriptions.map((m) => m.symbol)))

    const template = await formatEmail('/emailTemplates/stockAlertSubscriptionEmailTemplate.html', new Map<string, string>())
    const templateKey: DynamoKeys = 'email-template[stock-alert]'
    putRecord(templateKey, 'email-template', template)
    const result = processAlertTriggers(userProfile.username, dataCopy, quotes, template)
    result.subscriptions = sortAlerts(result.subscriptions)

    const newItems = result.subscriptions.flatMap((s) => s.triggers).filter((f) => f.status === 'started')
    result.subscriptions.forEach((sub) => {
      sub.triggers.forEach((tr) => {
        if (tr.status === 'started') {
          tr.status = 'queued'
        }
      })
    })
    setEmailMessage(result.message ?? null)
    setSuccessMessage(`messages generated: ${newItems.length}`)
    setIsLoading(false)
    mutate(alertsSearchhKey, result, { revalidate: false })
  }
  const handleSendEmail = async () => {
    if (emailMessage) {
      setIsLoading(true)
      await sendEmailFromClient({ ...emailMessage })
      const newData = { ...data }

      newData.subscriptions!.forEach((sub) => {
        sub.triggers.forEach((trigger) => {
          if (trigger.status === 'started') {
            trigger.status = 'queued'
          }
        })
      })
      const records: LambdaDynamoRequest[] = newData.subscriptions!.map((m) => {
        return {
          id: m.id,
          category: alertsSearchhKey,
          data: m,
          expiration: 0,
        }
      })
      await putRecordsBatch({ records: records })
      setEmailMessage(null)
      setIsLoading(false)
      mutate(alertsSearchhKey)
    }
  }
  const handleSearched = (text: string) => {
    setSearchFilter(text)
  }
  const handleQuoteLoaded = async (item: StockQuote) => {
    setIsLoading(true)
    const id = constructStockAlertsSubPrimaryKey(userProfile.username, item.Symbol)
    let sub = await getRecord<StockAlertSubscription>(id)
    if (!sub) {
      sub = getDefaultSubscription(userProfile, item, sub)
    }
    setEditSub(sub)
    setQuote(item)
    setIsLoading(false)
    setShowAddAlert(false)
  }
  const showHideAddAlert = (show: boolean) => {
    setShowAddAlert(!show)
    if (!show) {
      setQuote(null)
    }
  }
  const handleCloseEditForm = () => {
    setQuote(null)
    setEditSub(null)
    setShowAddAlert(false)
  }
  const handleSaveTriger = async (item: StockAlertTrigger) => {
    if (editSub && quote) {
      setIsLoading(true)
      await saveTrigger(userProfile.username, editSub.id, quote, editSub, item)
      setIsLoading(false)
      mutate(alertsSearchhKey)
    }
    handleCloseEditForm()
  }
  const handleHideAddAlert = () => {
    setShowAddAlert(false)
    setQuote(null)
    setEditSub(null)
  }

  return (
    <Box py={2}>
      <PageHeader text='Alerts' backButtonRoute='/csr/stocks' />
      {quote && editSub && <StockSubscriptionForm show={true} onClose={handleCloseEditForm} onSave={handleSaveTriger} quote={quote} sub={editSub} />}
      {isLoading && <BackdropLoader />}
      {data && (
        <>
          <>
            <Box py={2} display={'flex'} justifyContent={'space-between'}>
              <Box display={'flex'} gap={2}>
                <PrimaryButton size='small' text='preview email' onClick={handleGenerateAlerts} />
                <PrimaryButton size='small' text='add alert' color='success' onClick={() => showHideAddAlert(showAddAlert)} />
              </Box>
            </Box>
            {emailMessage && <EmailPreview emailMessage={emailMessage} onClose={() => setEmailMessage(null)} onSend={handleSendEmail} />}
          </>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={10}>
                    <CenterStack>
                      <SearchWithinList onChanged={handleSearched} text={`search in ${numeral(data.subscriptions.length).format('###,###')} alerts`} />
                    </CenterStack>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterRecords(data).subscriptions.map((sub) => (
                  <StockAlertRow key={sub.id} sub={sub} username={userProfile.username} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {successMesssage && <SnackbarSuccess show={true} text={successMesssage} duration={3000} />}
      <FormDialog title='add alert' show={showAddAlert} onCancel={handleHideAddAlert}>
        <StocksLookup onFound={handleQuoteLoaded} />
      </FormDialog>
    </Box>
  )
}

function sortAlerts(subs: StockAlertSubscription[]) {
  const subsMap = new Map<string, StockAlertSubscription>()
  subs.forEach((sub) => {
    subsMap.set(sub.symbol, sub)
  })
  const allTriggers = subs.flatMap((m) => m.triggers)
  const executedTriggers = sortArray(
    allTriggers.filter((m) => m.message),
    ['lastExecutedDate'],
    ['desc'],
  )
  const nonExecutedTriggers = sortArray(
    allTriggers.filter((m) => !m.executedDate),
    ['lastExecutedDate'],
    ['desc'],
  )

  const result: StockAlertSubscription[] = []
  executedTriggers.forEach((tr) => {
    result.push(subsMap.get(tr.symbol!)!)
  })
  nonExecutedTriggers.forEach((tr) => {
    result.push(subsMap.get(tr.symbol!)!)
  })
  return result
}

export default StockAlertsLayout
