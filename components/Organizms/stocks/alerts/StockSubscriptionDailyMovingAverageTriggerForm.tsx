import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Typography, Button, Stack } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { ControlledFreeTextInput } from 'components/Molecules/Forms/ReactHookForm/ControlledFreeTextInput'
import { ControlledNumberInput } from 'components/Molecules/Forms/ReactHookForm/ControlledNumberInput'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import { StockAlertTrigger, stockAlertTriggerSchema, StockQuote } from 'lib/backend/api/models/zModels'
import { SubmitHandler, useForm } from 'react-hook-form'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const StockSubscriptionDailyMovingAverageTriggerForm = ({
  trigger,
  quote,
  onSave,
  showManageAlertsButton,
}: {
  trigger: StockAlertTrigger
  quote: StockQuote
  onSave: (item: StockAlertTrigger) => void
  showManageAlertsButton: boolean
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StockAlertTrigger>({
    resolver: zodResolver(stockAlertTriggerSchema),
  })
  const router = useRouter()

  const onSubmit: SubmitHandler<StockAlertTrigger> = (formFields: StockAlertTrigger) => {
    const submitData = { ...formFields }
    onSave(submitData)
  }

  const [formData, setFormData] = useState(trigger)

  const handleEnabledChange = (val: boolean) => {
    setFormData({ ...formData, enabled: val })
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Hidden fields */}
        <ControlledFreeTextInput control={control} fieldName='status' defaultValue={formData.status} label='status' hidden />
        <ControlledFreeTextInput control={control} fieldName='typeId' defaultValue={formData.typeId} label='status' hidden />
        <ControlledFreeTextInput control={control} fieldName='typeDescription' defaultValue={formData.typeDescription ?? ''} label='typeDescription' hidden />
        <ControlledFreeTextInput control={control} fieldName='typeInstruction' defaultValue={formData.typeInstruction ?? ''} label='typeInstruction' hidden />
        <ControlledFreeTextInput control={control} fieldName='executedDate' defaultValue={formData.executedDate} label='executedDate' hidden />
        <ControlledFreeTextInput control={control} fieldName='message' defaultValue={formData.message} label='message' hidden />
        <ControlledNumberInput control={control} fieldName='order' type='number' defaultValue={formData.order} label='order' hidden />
        {/* Hidden fields end */}
        <Stack>
          <Box display={'flex'} flexDirection={'column'} gap={1}>
            <Box>
              <Box display={'flex'} gap={1} alignItems={'center'} pt={2}>
                <NotificationsIcon fontSize='medium' />
                <Typography variant='h5'>{`${formData.typeDescription}`}</Typography>
              </Box>

              <Typography variant={'body2'} pt={2}>
                {formData.typeInstruction}
              </Typography>
              <Box pt={3} pb={2} display={'flex'} flexDirection={'column'} gap={2}>
                <ControlledFreeTextInput
                  control={control}
                  fieldName='target'
                  defaultValue={formData.target}
                  label=''
                  placeholder='target'
                  required
                  endAdorn='%'
                />
                {errors.target && <Alert severity={'error'}>{`${errors.target.message}`}</Alert>}

                <Box display={'flex'} gap={1} alignItems={'center'}>
                  <ControlledSwitch control={control} fieldName='enabled' defaultValue={formData.enabled} onChanged={handleEnabledChange} />
                  <Typography>{`${formData.enabled ? 'enabled' : 'disabled'}`}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Stack>
        <Box>
          <Box py={2} display={'flex'} gap={2}>
            <PrimaryButton text='save' type='submit' size='small' />
            {showManageAlertsButton && (
              <Button variant='text' onClick={() => router.push('/market/stocks/alerts')}>
                manage all alerts
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default StockSubscriptionDailyMovingAverageTriggerForm
