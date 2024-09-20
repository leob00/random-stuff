import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@mui/material'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import DateAndTimePicker2 from 'components/Molecules/Forms/ReactHookForm/DateAndTimePicker2'
import { Job } from 'lib/backend/api/qln/qlnApi'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const JobFormSchema = z.object({
  nextRunDate: z.string().optional().nullable(),
  status: z.number(),
  //.refine((val) => !val || val && , { message: 'Folder already exists' }),
})
type FolderFields = z.infer<typeof JobFormSchema>

const onSubmit: SubmitHandler<FolderFields> = (formData) => {
  const submitData = { ...formData }
}

const JobEditDisplay = ({ data, mutateKey }: { data: Job; mutateKey: string }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FolderFields>({
    resolver: zodResolver(JobFormSchema),
    mode: 'onTouched',
    defaultValues: {
      nextRunDate: data.NextRunDate,
    },
    resetOptions: {
      keepDefaultValues: true,
    },
  })

  const formValues = watch()

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} alignItems={'center'} flexDirection={'row'} gap={1} py={4}>
          <Box display={'flex'} alignItems={'center'} flexDirection={'column'} gap={1}>
            <Box display={'flex'} alignItems={'center'} flexDirection={'row'} gap={2}>
              <ReadOnlyField label='next run date' />
              <Box>
                <Controller
                  name={'nextRunDate'}
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <DateAndTimePicker2 value={formValues.nextRunDate} errorMessage={errors.nextRunDate?.message} onDateSelected={onChange} {...field} />
                  )}
                ></Controller>
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default JobEditDisplay
