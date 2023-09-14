import { Alert, Box, Stack, Typography, TextField, useTheme } from '@mui/material'
import React from 'react'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import StockSearch from 'components/Atoms/Inputs/StockSearch'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { CasinoBlue } from 'components/themes/mainTheme'
import { getPositiveNegativeColor } from 'components/Organizms/stocks/StockListItem'
import { DropdownItem } from 'lib/models/dropdown'
import dayjs from 'dayjs'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { ControlledSelect } from 'components/Molecules/Forms/ReactHookForm/ControlledSelect'
import { ControlledFreeTextInput } from 'components/Molecules/Forms/ReactHookForm/ControlledFreeTextInput'
import { ControlledDateTimePicker } from 'components/Molecules/Forms/ReactHookForm/ControlledDateTimePicker'
import { StockPosition } from 'lib/backend/api/aws/apiGateway'

const checkPrice = (val: any) => {
  if (isNaN(val)) {
    return false
  }
  return true
}

const TransactionFieldsSchema = z.object({
  quantity: z.number().min(1, { message: 'Please enter a valid quantity' }),
  price: z
    .string()
    .min(1)
    .refine((val: any) => checkPrice(val), { message: 'Please enter a valid price' }),
  type: z.string(),
  date: z.preprocess((arg: any) => (typeof arg == 'object' ? dayjs(arg).format() : null), z.string().nullable()),
})

export type TransactionFields = z.infer<typeof TransactionFieldsSchema>

const AddTransactionForm = ({
  position,
  title,
  onSubmitted,
  onCancel,
  error,
}: {
  position: StockPosition
  title?: string
  onSubmitted: (data: TransactionFields) => void
  onCancel: () => void
  error?: string
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFields>({
    resolver: zodResolver(TransactionFieldsSchema),
  })
  const theme = useTheme()
  const [isLoading, setIsLoading] = React.useState(false)

  const onSubmit: SubmitHandler<TransactionFields> = (formData: TransactionFields) => {
    // setIsLoading(true)
    const submitData = { ...formData }
    onSubmitted(submitData)
  }

  const typeOptions: DropdownItem[] = []
  if (position.type === 'long') {
    typeOptions.push({ text: 'Buy', value: 'buy' })
    if (position.openQuantity > 0) {
      typeOptions.push({ text: 'Sell', value: 'sell' })
    }
  }
  if (position.type === 'short') {
    typeOptions.push({ text: 'Sell short', value: 'sell short' })
    if (position.openQuantity > 0) {
      typeOptions.push({ text: 'Buy to cover', value: 'nuy to cover' })
    }
  }

  return (
    <Box>
      {isLoading && <BackdropLoader />}
      {title && (
        <Typography variant='h5' py={2}>
          {title}
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={4}>
          <>
            <ControlledSelect control={control} fieldName='type' items={typeOptions} defaultValue={typeOptions[0].value} label='type' />
            <TextField
              {...register('quantity', { valueAsNumber: true })}
              type={'number'}
              label={'quantity'}
              placeholder={'quantity'}
              autoComplete='off'
              sx={{ input: { color: theme.palette.mode === 'light' ? CasinoBlue : 'unset' } }}
              size='small'
              InputProps={{
                color: 'secondary',
                autoComplete: 'off',
              }}
              defaultValue={0}
            />
            <ControlledFreeTextInput control={control} fieldName='price' defaultValue={''} label='price' placeholder='price' />
            <ControlledDateTimePicker control={control} fieldName='date' defaultValue={dayjs().format()} label='' />
          </>

          {errors.quantity && <Alert severity={'error'}>{'Please enter a valid quantity'}</Alert>}
          {errors.price && <Alert severity={'error'}>{'Please enter a valid price'}</Alert>}
          {errors.date && <Alert severity={'error'}>{'Please enter a valid date'}</Alert>}
          {error && <Alert severity={'error'}>{error}</Alert>}
          <Stack direction={'row'} alignItems={'center'} gap={2} justifyContent={'flex-end'}>
            <Box>
              <SecondaryButton text='cancel' size='small' onClick={onCancel} />
            </Box>
            <PrimaryButton text='save' type='submit' size='small' />
          </Stack>
        </Box>
      </form>
    </Box>
  )
}

export default AddTransactionForm
