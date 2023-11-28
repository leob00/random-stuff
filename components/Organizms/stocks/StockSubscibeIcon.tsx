import { Box, IconButton, Typography } from '@mui/material'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import useSWR, { mutate } from 'swr'
import { getRecord, putRecord } from 'lib/backend/csr/nextApiWrapper'
import { constructStockAlertsSubPrimaryKey, constructStockAlertsSubSecondaryKey } from 'lib/backend/api/aws/util'
import { quoteSubscriptionSchema, StockAlertSubscription, StockAlertTrigger, StockQuote } from 'lib/backend/api/models/zModels'
import JsonView from 'components/Atoms/Boxes/JsonView'
import StockSubscriptionTriggerForm from './StockSubscriptionTriggerForm'
import NotificationsIcon from '@mui/icons-material/Notifications'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { sortArray } from 'lib/util/collections'

const StockSubscibeIcon = ({ userProfile, quote }: { userProfile: UserProfile; quote: StockQuote }) => {
  const [showAlertEdit, setShowAlertEdit] = React.useState(false)
  const subscriptionId = constructStockAlertsSubPrimaryKey(userProfile.username, quote.Symbol)

  const fetcherFn = async (url: string, key: string) => {
    const response = await getRecord<StockAlertSubscription>(subscriptionId)
    return response
  }

  const { data, isLoading, isValidating } = useSWR(subscriptionId, ([url, key]) => fetcherFn(url, key))

  const hasActiveTriggers = data ? data.triggers.filter((m) => m.enabled).length > 0 : false

  const handleEditAlerts = () => {
    setShowAlertEdit(true)
  }
  const dailyMoveTrigger: StockAlertTrigger = data?.triggers.find((m) => m.typeId === 'dailyPercentMove') ?? {
    enabled: true,
    status: 'queued',
    target: '3',
    typeDescription: 'Daily moving average',
    typeInstruction: 'Alert me when the daily moving average exceeds a set value (up/down).',
    typeId: 'dailyPercentMove',
    order: 1,
  }

  const handleSaveTrigger = async (item: StockAlertTrigger) => {
    const newData: StockAlertSubscription = data ?? {
      id: subscriptionId,
      symbol: quote.Symbol,
      triggers: [],
    }
    const newTriggers = newData.triggers.filter((m) => m.typeId !== item.typeId)
    newTriggers.push(item)
    newData.triggers = sortArray(newTriggers, ['order'], ['asc'])
    await putRecord(newData.id, constructStockAlertsSubSecondaryKey(userProfile.username), newData)
    mutate(subscriptionId)
  }

  return (
    <Box>
      {isLoading && <BackdropLoader />}
      {isValidating && <BackdropLoader />}
      <StockSubscriptionTriggerForm show={showAlertEdit} trigger={dailyMoveTrigger} onClose={() => setShowAlertEdit(false)} quote={quote} onSave={handleSaveTrigger} />
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
    </Box>
  )
}

export default StockSubscibeIcon
