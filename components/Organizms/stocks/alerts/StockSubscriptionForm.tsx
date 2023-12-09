import { Box, Typography } from '@mui/material'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { StockAlertSubscription, StockAlertTrigger, StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import StockListItem from '../StockListItem'
import StockSubscriptionDailyMovingAverageTriggerForm from './StockSubscriptionDailyMovingAverageTriggerForm'
import StockSubscriptionPriceTargetTriggerForm from './StockSubscriptionPriceTargetTriggerForm'

const StockSubscriptionForm = ({
  show,
  sub,
  quote,
  onSave,
  onClose,
}: {
  show: boolean
  sub: StockAlertSubscription
  quote: StockQuote
  onSave: (trigger: StockAlertTrigger) => void
  onClose: () => void
}) => {
  const renderForm = (trigger: StockAlertTrigger, index: number) => {
    switch (trigger.typeId) {
      case 'dailyPercentMove':
        return <StockSubscriptionDailyMovingAverageTriggerForm trigger={trigger} quote={quote} onSave={onSave} showManageAlertsButton={false} />
      case 'price':
        return <StockSubscriptionPriceTargetTriggerForm trigger={trigger} quote={quote} onSave={onSave} showManageAlertsButton={false} />
    }
    return <></>
  }

  return (
    <FormDialog title={'Alerts'} show={show} onCancel={onClose}>
      <>
        <Box>
          <StockListItem isStock={true} item={quote} disabled showGroupName={false} />
        </Box>
        {sub.triggers.map((trigger, i) => (
          <Box key={trigger.typeId}>{renderForm(trigger, i)}</Box>
        ))}
      </>
    </FormDialog>
  )
}

export default StockSubscriptionForm
