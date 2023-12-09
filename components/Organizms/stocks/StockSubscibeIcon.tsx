import { Box, Button, IconButton } from '@mui/material'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import useSWR, { mutate } from 'swr'
import { deleteRecord, getRecord, putRecord } from 'lib/backend/csr/nextApiWrapper'
import { constructStockAlertsSubPrimaryKey, constructStockAlertsSubSecondaryKey } from 'lib/backend/api/aws/util'
import { StockAlertSubscription, StockAlertTrigger, StockQuote } from 'lib/backend/api/models/zModels'
import NotificationsIcon from '@mui/icons-material/Notifications'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { sortArray } from 'lib/util/collections'
import { useRouter } from 'next/router'
import StockSubscriptionForm from './alerts/StockSubscriptionForm'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import { getDefaultSubscription, saveTrigger } from 'lib/ui/alerts/stockAlertHelper'

const StockSubscibeIcon = ({ userProfile, quote }: { userProfile: UserProfile; quote: StockQuote }) => {
  const [showAlertEdit, setShowAlertEdit] = React.useState(false)
  const [snackbarMessage, setSnackBarMessage] = React.useState<string | null>(null)
  const subscriptionId = constructStockAlertsSubPrimaryKey(userProfile.username, quote.Symbol)
  const router = useRouter()

  const fetcherFn = async (url: string, key: string) => {
    const response = await getRecord<StockAlertSubscription>(subscriptionId)
    return response
  }

  const { data, isLoading, isValidating } = useSWR(subscriptionId, ([url, key]) => fetcherFn(url, key))

  const hasActiveTriggers = data ? data.triggers.filter((m) => m.enabled).length > 0 : false

  const handleEditAlerts = () => {
    setShowAlertEdit(true)
  }

  const selectedSub = getDefaultSubscription(userProfile, quote, data)

  const handleSaveTrigger = async (item: StockAlertTrigger) => {
    setSnackBarMessage(null)
    const newSub: StockAlertSubscription = data ? { ...data } : { ...selectedSub }
    await saveTrigger(userProfile.username, subscriptionId, quote, newSub, item)
    setShowAlertEdit(false)
    mutate(subscriptionId)
    setSnackBarMessage('saved!')
  }

  return (
    <Box>
      {isLoading && <BackdropLoader />}
      {isValidating && <BackdropLoader />}
      <StockSubscriptionForm show={showAlertEdit} sub={selectedSub} quote={quote} onClose={() => setShowAlertEdit(false)} onSave={handleSaveTrigger} />

      <Box display={'flex'} gap={2} alignItems={'center'}>
        <Box>
          {!data && (
            <IconButton size='small' color='success' onClick={handleEditAlerts}>
              <NotificationAddIcon fontSize='small' />
            </IconButton>
          )}
          {hasActiveTriggers && (
            <IconButton size='small' color='success' onClick={handleEditAlerts}>
              <NotificationsIcon fontSize='small' />
            </IconButton>
          )}
          {data && !hasActiveTriggers && (
            <IconButton size='small' color='success' onClick={handleEditAlerts}>
              <NotificationsOffIcon fontSize='small' />
            </IconButton>
          )}
        </Box>
        <Box>
          <Button onClick={() => router.push('/csr/stocks/alerts')}>manage all alerts</Button>
        </Box>
      </Box>
      {snackbarMessage && <SnackbarSuccess show={snackbarMessage !== null} text={snackbarMessage} duration={1000} />}
    </Box>
  )
}

export default StockSubscibeIcon
