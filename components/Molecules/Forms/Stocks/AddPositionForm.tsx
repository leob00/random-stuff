import { Alert, Box, Stack, Typography, TextField, useTheme } from '@mui/material'
import React from 'react'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ControlledFreeTextInput } from '../ReactHookForm/ControlledFreeTextInput'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import StockSearch from 'components/Atoms/Inputs/StockSearch'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { CasinoBlue } from 'components/themes/mainTheme'
import { getPositiveNegativeColor } from 'components/Organizms/stocks/StockListItem'
import { ControlledSelect } from '../ReactHookForm/ControlledSelect'
import { DropdownItem } from 'lib/models/dropdown'
import dayjs from 'dayjs'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import DateAndTimePicker2 from '../ReactHookForm/DateAndTimePicker2'

const checkPrice = (val: any) => {
  if (isNaN(val)) {
    return false
  }
  return true
}

const PositionFieldsSchema = z.object({
  symbol: z.string().min(1, { message: 'Please enter a stock symbol' }),
  quantity: z.number().min(1, { message: 'Please enter a valid quantity' }),
  price: z
    .string()
    .min(1)
    .refine((val: any) => checkPrice(val), { message: 'Please enter a valid price' }),
  type: z.string(),
  date: z.preprocess((arg: any) => (typeof arg == 'object' ? dayjs(arg).format() : null), z.string().nullable()),
})

export type PositionFields = z.infer<typeof PositionFieldsSchema>

const AddPositionForm = ({
  obj,
  title,
  onSubmitted,
  onCancel,
  error,
}: {
  obj: PositionFields
  title?: string
  onSubmitted: (data: PositionFields, quote: StockQuote) => void
  onCancel: () => void
  error?: string
}) => {
  const {
    control,
    register,
    handleSubmit,
    getValues,
    reset,
    resetField,
    setValue,
    formState: { errors },
  } = useForm<PositionFields>({
    resolver: zodResolver(PositionFieldsSchema),
  })
  const theme = useTheme()
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedQuote, setSelectedQuote] = React.useState<StockQuote | null>(null)

  const onSubmit: SubmitHandler<PositionFields> = (formData) => {
    setIsLoading(true)
    const submitData = { ...formData }
    onSubmitted(submitData, selectedQuote!)
  }
  const handleSymbolSelected = (quote: StockQuote) => {
    //resetField('symbol')
    setValue('symbol', quote.Symbol)
    setSelectedQuote(quote)
  }
  const typeOptions: DropdownItem[] = [
    {
      text: 'Buy',
      value: 'long',
    },
    {
      text: 'Sell Short',
      value: 'short',
    },
  ]
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
          <StockSearch onSymbolSelected={handleSymbolSelected} />
          <Box display={'none'}>
            <ControlledFreeTextInput
              control={control}
              fieldName='symbol'
              defaultValue={selectedQuote ? selectedQuote.Symbol : ''}
              label=''
              placeholder='stock symbol *'
              readOnly
            />
          </Box>
          {selectedQuote && (
            <>
              <Box>
                <Typography variant='h5'>{`${selectedQuote.Company} (${selectedQuote.Symbol})`}</Typography>
                <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} pb={2} alignItems={'center'}>
                  <Stack direction={'row'} spacing={2} sx={{ backgroundColor: 'unset' }} pt={1}>
                    <Typography variant='h5' color={getPositiveNegativeColor(selectedQuote.Change, theme.palette.mode)}>{`${selectedQuote.Price.toFixed(
                      2,
                    )}`}</Typography>
                    <Typography variant='h5' color={getPositiveNegativeColor(selectedQuote.Change, theme.palette.mode)}>{`${selectedQuote.Change.toFixed(
                      2,
                    )}`}</Typography>
                    <Typography variant='h5' color={getPositiveNegativeColor(selectedQuote.Change, theme.palette.mode)}>{`${selectedQuote.ChangePercent.toFixed(
                      2,
                    )}%`}</Typography>
                  </Stack>
                </Stack>
              </Box>
              <ControlledSelect control={control} fieldName='type' items={typeOptions} defaultValue={obj.type} label='type' />
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
                defaultValue={obj.quantity}
              />
              <ControlledFreeTextInput control={control} fieldName='price' defaultValue={selectedQuote.Price.toFixed(2)} label='price' placeholder='price' />
              <Controller
                name={'date'}
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <DateAndTimePicker2 errorMessage={errors.date?.message} value={value} onDateSelected={onChange} {...field} />
                )}
              />
            </>
          )}

          {errors.symbol && <Alert severity={'error'}>{errors.symbol?.message}</Alert>}
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

export default AddPositionForm
