import { Box, Button, IconButton, Typography } from '@mui/material'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import { mutate } from 'swr'
import { getDynamoItemData } from 'lib/backend/csr/nextApiWrapper'
import { constructStockAlertsSubPrimaryKey } from 'lib/backend/api/aws/util'
import { StockAlertSubscription, StockAlertTrigger, StockQuote } from 'lib/backend/api/models/zModels'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useRouter } from 'next/navigation'
import StockSubscriptionForm from './alerts/StockSubscriptionForm'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import { getDefaultSubscription, saveTrigger } from 'lib/ui/alerts/stockAlertHelper'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const StockSubscibeIcon = ({
  userProfile,
  quote,
  size = 'small',
  onClicked,
}: {
  userProfile: UserProfile
  quote: StockQuote
  size?: 'small' | 'medium' | 'large'
  onClicked?: () => void
}) => {
  const [showAlertEdit, setShowAlertEdit] = useState(false)
  const [snackbarMessage, setSnackBarMessage] = useState<string | null>(null)
  const subscriptionId = constructStockAlertsSubPrimaryKey(userProfile.username, quote.Symbol)
  const router = useRouter()

  const dataFunc = async () => {
    const response = await getDynamoItemData<StockAlertSubscription | null>(subscriptionId)
    return response
  }

  const { data, isLoading } = useSwrHelper(subscriptionId, dataFunc, { revalidateOnFocus: false })

  const hasActiveTriggers = data ? data.triggers.filter((m) => m.enabled).length > 0 : false

  const handleEditAlerts = () => {
    setShowAlertEdit(true)
    onClicked?.()
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
      {isLoading && <ComponentLoader />}
      <Box>
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            {!data && (
              <IconButton size='small' color='info' onClick={handleEditAlerts}>
                <NotificationAddIcon fontSize={size} />
              </IconButton>
            )}
            {hasActiveTriggers && (
              <IconButton size='small' color='success' onClick={handleEditAlerts}>
                <NotificationsIcon fontSize={size} />
                <CheckIcon fontSize={size} />
              </IconButton>
            )}
            {data && !hasActiveTriggers && (
              <IconButton size='small' color='success' onClick={handleEditAlerts}>
                <NotificationsOffIcon fontSize={size} />
              </IconButton>
            )}
          </Box>
          <Box>
            <Button onClick={() => router.push('/market/stocks/alerts')}>
              <Typography variant='body2'>manage alerts</Typography>
            </Button>
          </Box>
        </Box>
        {snackbarMessage && <SnackbarSuccess show={!!snackbarMessage} text={snackbarMessage} duration={1000} onClose={() => setSnackBarMessage(null)} />}
        <StockSubscriptionForm show={showAlertEdit} sub={selectedSub} quote={quote} onClose={() => setShowAlertEdit(false)} onSave={handleSaveTrigger} />
      </Box>
    </Box>
  )
}

export default StockSubscibeIcon
