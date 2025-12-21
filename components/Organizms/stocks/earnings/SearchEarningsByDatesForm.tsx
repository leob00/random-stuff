import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import FormDatePicker from 'components/Molecules/Forms/ReactHookForm/FormDatePicker'
import dayjs from 'dayjs'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrAfter)

const EarningsSearchSchema = z
  .object({
    startDate: z.string().refine((val) => val && dayjs(val).isValid(), { message: 'date is not in valid format' }),
    endDate: z.string().refine((val) => val && dayjs(val).isValid(), { message: 'date is not in valid format' }),
  })
  .refine((m) => dayjs(m.endDate).isSameOrAfter(dayjs(m.startDate)), { message: 'end date should not be before start date', path: ['endDate'] })

export type EarningsSearchDateFields = z.infer<typeof EarningsSearchSchema>

const SearchEarningsByDatesForm = ({ onSubmitted }: { onSubmitted: (data: EarningsSearchDateFields) => void }) => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<EarningsSearchDateFields>({
    resolver: zodResolver(EarningsSearchSchema),
    mode: 'onSubmit',
  })
  const onSubmit: SubmitHandler<EarningsSearchDateFields> = (data) => {
    onSubmitted(data)
  }
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'center'}>
            <Box>
              <Controller
                name={'startDate'}
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormDatePicker placeholder='start date' errorMessage={errors.startDate?.message} onDateSelected={onChange} />
                )}
              />
            </Box>
            <Box>
              <Controller
                name={'endDate'}
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormDatePicker placeholder='end date' errorMessage={errors.endDate?.message} onDateSelected={onChange} />
                )}
              />
            </Box>
          </Box>
          <Box pt={6}>
            <HorizontalDivider />
          </Box>
          <Box display={'flex'} justifyContent={'flex-end'} pr={4}>
            <PrimaryButton type='submit' text='Search' />
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default SearchEarningsByDatesForm
