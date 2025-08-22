import { Box } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { StockMovingAvgFilter, StockMovingAvgFilterSchema } from './stockMovingAvgFilter'
import { zodResolver } from '@hookform/resolvers/zod'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import { DropdownItemNumeric } from 'lib/models/dropdown'
const StockMovingAvgFilterForm = ({ onSubmitted }: { onSubmitted: (item: StockMovingAvgFilter) => void }) => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors },
  } = useForm<StockMovingAvgFilter>({
    resolver: zodResolver(StockMovingAvgFilterSchema),
    mode: 'onSubmit',
    shouldUnregister: false,
  })

  const formValues = watch()
  const takeOptions: DropdownItemNumeric[] = [{ text: '1', value: 1 }]

  const onSubmit: SubmitHandler<StockMovingAvgFilter> = (formData) => {
    onSubmitted(formData)
  }
  return (
    <Box py={2}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name={'take'}
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <FormDropdownListNumeric minWidth={300} label='status' options={takeOptions} value={formValues.take} onOptionSelected={onChange} {...field} />
            )}
          ></Controller>
        </form>
      </Box>
    </Box>
  )
}

export default StockMovingAvgFilterForm
