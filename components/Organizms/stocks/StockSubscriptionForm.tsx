import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Typography } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import { data } from 'components/Molecules/Charts/MultiDatasetBarchartExmple'
import { ControlledFreeTextInput } from 'components/Molecules/Forms/ReactHookForm/ControlledFreeTextInput'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import { constructStockAlertsSubPrimaryKey } from 'lib/backend/api/aws/util'
import { quoteSubscriptionSchema, StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const StockSubscriptionForm = ({
  show,
  data,
  quote,
  username,
  onClose,
}: {
  show: boolean
  data?: any
  quote: StockQuote
  username: string
  onClose: () => void
}) => {
  type defaultDataType = z.infer<typeof quoteSubscriptionSchema>
  const defaultData: defaultDataType = {
    symbol: quote.Symbol,
    id: constructStockAlertsSubPrimaryKey(username, quote.Symbol),
    triggers: [
      {
        enabled: false,
        status: 'queued',
        target: '3',
        typeDescription: 'Daily moving average',
        typeInstruction: 'Alert me when the daily moving average exceeds a set value (up/down).',
        typeId: 'dailyPercentMove',
      },
    ],
  }

  const formData = data ? quoteSubscriptionSchema.parse(data) : defaultData

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<defaultDataType>({
    resolver: zodResolver(quoteSubscriptionSchema),
  })

  const onSubmit: SubmitHandler<defaultDataType> = (formFields: defaultDataType) => {
    // setIsLoading(true)
    const submitData = { ...formFields }
    console.log(submitData)
  }

  return (
    <FormDialog title={'Alerts'} show={show} onCancel={onClose} fullScreen>
      <CenterStack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display={'flex'} flexDirection={'column'} gap={1}>
            <Typography variant='h5'>{`${quote.Company} (${quote.Symbol})`}</Typography>
            <ControlledFreeTextInput control={control} fieldName='symbol' defaultValue={formData.symbol} label='symbol' hidden />
            <ControlledFreeTextInput control={control} fieldName='id' defaultValue={formData.id} label='symbol' hidden />
            {formData.triggers.map((item, i) => (
              <Box key={i}>
                <Typography variant='h5'>{item.typeDescription}</Typography>
                <Typography>{item.typeInstruction}</Typography>
                <Box pt={2} pb={2} display={'flex'} flexDirection={'column'} gap={2}>
                  <ControlledFreeTextInput
                    control={control}
                    fieldName='target'
                    defaultValue={item.target}
                    label='daily percent move'
                    placeholder='daily percent move'
                    required
                  />
                  <ControlledFreeTextInput control={control} fieldName='status' defaultValue={item.status} label='status' hidden />
                  <Box display={'flex'} gap={1} alignItems={'center'}>
                    <Typography>enabled:</Typography>
                    <ControlledSwitch control={control} fieldName='enabled' defaultValue={item.enabled} />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
          {errors.triggers && <Alert severity={'error'}>{'Please complete all fields'}</Alert>}
          <Box py={2} display={'flex'} alignItems={'flex-end'}>
            <PrimaryButton text='save' type='submit' size='small' />
          </Box>
        </form>
      </CenterStack>
    </FormDialog>
  )
}

export default StockSubscriptionForm
