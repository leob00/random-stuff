import { Box, Typography } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { StockMovingAvgFilter, StockMovingAvgFilterSchema } from './stockMovingAvgFilter'
import { zodResolver } from '@hookform/resolvers/zod'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import { DropdownItemNumeric } from 'lib/models/dropdown'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
const StockMovingAvgFilterForm = ({ onSubmitted }: { onSubmitted: (item: StockMovingAvgFilter) => void }) => {
  const { stockReportSettings, setStockMovingAvgFilter } = useLocalStore()

  const {
    control,
    handleSubmit,
    reset,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StockMovingAvgFilter>({
    resolver: zodResolver(StockMovingAvgFilterSchema),
    mode: 'onSubmit',
    defaultValues: stockReportSettings.topMovingAvg.filter,
  })

  const formValues = watch()
  const takeOptions: DropdownItemNumeric[] = [
    { text: '1', value: 1 },
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '25', value: 25 },
    { text: '100', value: 100 },
    { text: '250', value: 250 },
    { text: '500', value: 500 },
  ]

  const daysOptions: DropdownItemNumeric[] = [
    { text: '1', value: 1 },
    { text: '7', value: 7 },
    { text: '30', value: 30 },
    { text: '90', value: 90 },
    { text: '180', value: 180 },
    { text: '365', value: 365 },
  ]

  const onSubmit: SubmitHandler<StockMovingAvgFilter> = (formData) => {
    const submitData = { ...formData }
    setStockMovingAvgFilter(submitData)
    onSubmitted(submitData)
  }
  console.log(errors)
  return (
    <Box py={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <Box display={'flex'} flexDirection={'column'} gap={1}>
            <Controller
              name={'take'}
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FormDropdownListNumeric minWidth={300} label='take' options={takeOptions} value={formValues.take} onOptionSelected={onChange} {...field} />
              )}
            />
            <Controller
              name={'days'}
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FormDropdownListNumeric minWidth={300} label='days' options={daysOptions} value={formValues.days} onOptionSelected={onChange} {...field} />
              )}
            />
            <Typography variant='h6'>Market Cap</Typography>
            <ControlledSwitch
              control={control}
              fieldName='includeMegaCap'
              label='include mega cap'
              defaultValue={formValues.includeMegaCap === undefined ? true : formValues.includeMegaCap}
              onChanged={(val: boolean) => {
                setValue('includeMegaCap', val)
              }}
            />
            <ControlledSwitch
              control={control}
              fieldName='includeLargeCap'
              label='include large cap'
              defaultValue={formValues.includeLargeCap ?? false}
              onChanged={(val: boolean) => {
                setValue('includeLargeCap', val)
              }}
            />
            <ControlledSwitch
              control={control}
              fieldName='includeMidCap'
              label='include mid cap'
              defaultValue={formValues.includeMidCap ?? false}
              onChanged={(val: boolean) => {
                setValue('includeMidCap', val)
              }}
            />
            <ControlledSwitch
              control={control}
              fieldName='includeSmallCap'
              label='include small cap'
              defaultValue={formValues.includeSmallCap ?? false}
              onChanged={(val: boolean) => {
                setValue('includeSmallCap', val)
              }}
            />
            {errors.includeMegaCap?.message && <ErrorMessage text={errors.includeMegaCap.message} />}
          </Box>
          <Box py={2} display={'flex'} justifyContent={'flex-end'} pr={1}>
            <PrimaryButton type='submit' text='Apply' />
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default StockMovingAvgFilterForm
