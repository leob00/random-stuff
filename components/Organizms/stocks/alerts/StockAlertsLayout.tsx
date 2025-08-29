import { Box, Table, TableBody, TableContainer } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useAlertsController } from 'hooks/stocks/alerts/useAlertsController'
import { processAlertTriggers } from 'lib/backend/alerts/stockAlertProcessor'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructStockAlertsSubPrimaryKey, constructStockAlertsSubSecondaryKey } from 'lib/backend/api/aws/util'
import { StockAlertSubscription, StockAlertSubscriptionWithMessage, StockAlertTrigger, StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { getDynamoItemData, putRandomStuffBatch, searchDynamoItemsByCategory, sendEmailFromClient } from 'lib/backend/csr/nextApiWrapper'
import { getDefaultSubscription, sortAlerts } from 'lib/ui/alerts/stockAlertHelper'
import { formatEmail } from 'lib/ui/mailUtil'
import { uniq } from 'lodash'
import EmailPreview from './EmailPreview'
import StockAlertRow from './StockAlertRow'
import StockSubscriptionForm from './StockSubscriptionForm'
import { saveTrigger } from 'lib/ui/alerts/stockAlertHelper'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import TableHeaderWithSearchWithinList from 'components/Atoms/Tables/TableHeaderWithSearchWithinList'
import { EmailMessage } from 'app/serverActions/aws/ses/ses'
import { useState } from 'react'
import { RandomStuffDynamoItem } from 'app/serverActions/aws/dynamo/dynamo'
import { getUtcNow } from 'lib/util/dateUtil'
import { getMapFromArray } from 'lib/util/collectionsNative'
import StockSearch from 'components/Atoms/Inputs/StockSearch'

const StockAlertsLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const alertsSearchhKey = constructStockAlertsSubSecondaryKey(userProfile.username)
  const [searchFilter, setSearchFilter] = useState('')
  const [showAddAlert, setShowAddAlert] = useState(false)

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
    const response = await searchDynamoItemsByCategory(alertsSearchhKey)
    const subs = response.map((m) => JSON.parse(m.data) as StockAlertSubscription)
    const model: StockAlertSubscriptionWithMessage = {
      subscriptions: sortAlerts(subs),
    }
    return model
  }

  const { data, isLoading, isAdmin, mutate, setIsLoading } = useAlertsController<StockAlertSubscriptionWithMessage>(alertsSearchhKey, dataFn)
  const [emailMessage, setEmailMessage] = useState<EmailMessage | null>(null)
  const [successMesssage, setSuccessMessage] = useState<string | null>(null)
  const [quote, setQuote] = useState<StockQuote | null>(null)
  const [editSub, setEditSub] = useState<StockAlertSubscription | null>(null)

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
    const quoteMap = getMapFromArray<StockQuote>(quotes, 'Symbol')
    const result = processAlertTriggers(userProfile.username, dataCopy, quoteMap, template)
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
      await sendEmailFromClient({ ...emailMessage, from: 'alertsender@quotelookup.net' })
      const newData = { ...data }

      newData.subscriptions!.forEach((sub) => {
        sub.triggers.forEach((trigger) => {
          if (trigger.status === 'started') {
            trigger.status = 'queued'
          }
        })
      })
      const records: RandomStuffDynamoItem[] = newData.subscriptions!.map((m) => {
        return {
          id: m.id,
          category: alertsSearchhKey,
          data: m,
          expiration: 0,
          key: constructStockAlertsSubPrimaryKey(userProfile.username, m.symbol),
          count: 1,
          last_modified: getUtcNow().format(),
        }
      })
      await putRandomStuffBatch(records)
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
    let sub = await getDynamoItemData<StockAlertSubscription>(id)
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
      <PageHeader text='Stock Alerts' backButtonRoute='/csr/stocks' />
      {quote && editSub && <StockSubscriptionForm show={true} onClose={handleCloseEditForm} onSave={handleSaveTriger} quote={quote} sub={editSub} />}
      {isLoading && <BackdropLoader />}
      {data && (
        <>
          <Box py={2} display={'flex'} justifyContent={'space-between'}>
            <Box display={'flex'} gap={2}>
              <PrimaryButton size='small' text='preview email' onClick={handleGenerateAlerts} />
              <PrimaryButton size='small' text='add alert' color='success' onClick={() => showHideAddAlert(showAddAlert)} />
            </Box>
          </Box>
          {emailMessage && <EmailPreview emailMessage={emailMessage} onClose={() => setEmailMessage(null)} onSend={handleSendEmail} />}
          <TableContainer>
            <Table>
              <TableHeaderWithSearchWithinList count={data.subscriptions.length} handleSearched={handleSearched} />
              <TableBody>
                {filterRecords(data).subscriptions.map((sub) => (
                  <StockAlertRow key={sub.id} sub={sub} username={userProfile.username} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {successMesssage && <SnackbarSuccess show={!!successMesssage} text={successMesssage} duration={3000} onClose={() => setSuccessMessage(null)} />}
      <FormDialog title='add alert' show={showAddAlert} onCancel={handleHideAddAlert}>
        <StockSearch onSymbolSelected={handleQuoteLoaded} clearOnSelect />
      </FormDialog>
    </Box>
  )
}

export default StockAlertsLayout
