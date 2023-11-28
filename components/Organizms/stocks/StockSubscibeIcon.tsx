import { Box, IconButton, Typography } from '@mui/material'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import useSWR, { mutate } from 'swr'
import { getRecord } from 'lib/backend/csr/nextApiWrapper'
import { constructStockAlertsSubPrimaryKey } from 'lib/backend/api/aws/util'
import { quoteSubscriptionSchema, StockQuote } from 'lib/backend/api/models/zModels'
import JsonView from 'components/Atoms/Boxes/JsonView'
import StockSubscriptionForm from './StockSubscriptionForm'

const StockSubscibeIcon = ({ userProfile, quote }: { userProfile: UserProfile; quote: StockQuote }) => {
  const [showAlertEdit, setShowAlertEdit] = React.useState(false)
  const subscriptionId = constructStockAlertsSubPrimaryKey(userProfile.username, quote.Symbol)

  const fetcherFn = async (url: string, key: string) => {
    const response = await getRecord<typeof quoteSubscriptionSchema>(subscriptionId)

    return response
  }

  const { data, isLoading, isValidating } = useSWR(subscriptionId, ([url, key]) => fetcherFn(url, key))

  const handleEditAlerts = () => {
    setShowAlertEdit(true)
  }

  return (
    <Box>
      {/* <FormDialog title={'Alerts'} show={showAlertEdit} onCancel={() => setShowAlertEdit(false)} fullScreen>
        <Box>
          <Typography>coming soon</Typography>
          {data && <JsonView obj={data} />}
        </Box>
      </FormDialog> */}
      <StockSubscriptionForm show={showAlertEdit} data={data} onClose={() => setShowAlertEdit(false)} quote={quote} username={userProfile.username} />
      <Box>
        <IconButton size='small' color='success' onClick={handleEditAlerts}>
          <NotificationAddIcon fontSize='small' />
        </IconButton>
      </Box>
    </Box>
  )
}

export default StockSubscibeIcon
