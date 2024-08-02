import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import FormStockSearch from 'components/Molecules/Forms/ReactHookForm/FormStockSearch'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
const EarningsSearchSchema = z.object({
  symbol: z.string().refine((val) => val.length > 0, { message: 'required' }),
})

export type EarningsSearchFields = z.infer<typeof EarningsSearchSchema>

const SearchEarningsForm = ({ onSubmitted }: { onSubmitted: (data: EarningsSearchFields) => void }) => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<EarningsSearchFields>({
    resolver: zodResolver(EarningsSearchSchema),
    mode: 'onSubmit',
  })
  const onSubmit: SubmitHandler<EarningsSearchFields> = (data) => {
    onSubmitted(data)
  }
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <Controller
            name={'symbol'}
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <FormStockSearch onSelected={onChange} {...field} val={value} errorMessage={errors?.symbol?.message} />
            )}
          />
          <HorizontalDivider />
          <Box display={'flex'} justifyContent={'flex-end'} pr={4}>
            <PrimaryButton type='submit' text='Search' />
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default SearchEarningsForm
