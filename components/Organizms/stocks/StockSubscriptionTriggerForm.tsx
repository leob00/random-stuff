import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import { ControlledFreeTextInput } from 'components/Molecules/Forms/ReactHookForm/ControlledFreeTextInput'
import { ControlledNumberInput } from 'components/Molecules/Forms/ReactHookForm/ControlledNumberInput'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import { StockAlertTrigger, stockAlertTriggerSchema, StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import NotificationsIcon from '@mui/icons-material/Notifications'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import StockListItem from './StockListItem'

const StockSubscriptionTriggerForm = ({
  show,
  trigger,
  quote,
  onClose,
  onSave,
}: {
  show: boolean
  trigger: StockAlertTrigger
  quote: StockQuote
  onClose: () => void
  onSave: (item: StockAlertTrigger) => void
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StockAlertTrigger>({
    resolver: zodResolver(stockAlertTriggerSchema),
  })

  const onSubmit: SubmitHandler<StockAlertTrigger> = (formFields: StockAlertTrigger) => {
    const submitData = { ...formFields }
    onSave(submitData)
    onClose()
  }

  const [formData, setFormData] = React.useState(trigger)

  const handleEnabledChange = (val: boolean) => {
    setFormData({ ...formData, enabled: val })
  }

  return (
    <FormDialog title={'Alerts'} show={show} onCancel={onClose} fullScreen>
      <CenterStack>
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
          <Box display={'flex'} flexDirection={'column'} gap={1}>
            <Box>
              {/* <Typography variant='h4'>{`${quote.Company} (${quote.Symbol})`}</Typography> */}
              <StockListItem isStock={true} item={quote} disabled showGroupName={false} />
            </Box>
            <Box>
              <Box display={'flex'} gap={1} alignItems={'center'} pt={2}>
                <NotificationsIcon fontSize='medium' />
                <Typography variant='h5'>{`Alert trigger: ${formData.typeDescription}`}</Typography>
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
                {errors.target && <Alert severity={'error'}>{`Please enter a valid number.`}</Alert>}

                <Box display={'flex'} gap={1} alignItems={'center'}>
                  <ControlledSwitch control={control} fieldName='enabled' defaultValue={formData.enabled} onChanged={handleEnabledChange} />
                  <Typography>{`${formData.enabled ? 'enabled' : 'disabled'}`}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box py={2} display={'flex'} alignItems={'flex-end'}>
            <PrimaryButton text='save' type='submit' size='small' />
          </Box>
        </form>
      </CenterStack>
    </FormDialog>
  )
}

export default StockSubscriptionTriggerForm
