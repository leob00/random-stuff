import { Box } from '@mui/material'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import { StockAlertSubscription, StockAlertTrigger, StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import StockListItem from '../StockListItem'
import StockSubscriptionDailyMovingAverageTriggerForm from './StockSubscriptionDailyMovingAverageTriggerForm'
import StockSubscriptionPriceTargetTriggerForm from './StockSubscriptionPriceTargetTriggerForm'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

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
  const { userProfile, isValidating } = useProfileValidator()
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
        <Box>{!isValidating && <StockListItem marketCategory={'stocks'} item={quote} disabled showGroupName={false} userProfile={userProfile} />}</Box>
        {sub.triggers.map((trigger, i) => (
          <Box key={trigger.typeId}>{renderForm(trigger, i)}</Box>
        ))}
      </>
    </FormDialog>
  )
}

export default StockSubscriptionForm
