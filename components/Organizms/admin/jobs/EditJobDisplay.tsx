import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import DateAndTimePicker2 from 'components/Molecules/Forms/ReactHookForm/DateAndTimePicker2'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import { Job } from 'lib/backend/api/qln/qlnApi'
import { DropdownItemNumeric } from 'lib/models/dropdown'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const JobFormSchema = z.object({
  nextRunDate: z.string().optional().nullable(),
  status: z.number(),
  //.refine((val) => !val || val && , { message: 'Folder already exists' }),
})
type JobFields = z.infer<typeof JobFormSchema>

const EditJobDisplay = ({ data, onSave }: { data: Job; onSave: (item: Job) => void }) => {
  const jobStatusoptions: DropdownItemNumeric[] = [
    {
      text: '1 - In Progrss',
      value: 1,
    },
    {
      text: '1 - Completed',
      value: 2,
    },
  ]

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<JobFields>({
    resolver: zodResolver(JobFormSchema),
    mode: 'onTouched',
    defaultValues: {
      nextRunDate: data.NextRunDate,
      status: data.Status,
    },
  })

  const formValues = watch()

  const onSubmit: SubmitHandler<JobFields> = (formData) => {
    const item = { ...data, Status: formData.status, NextRunDate: formData.nextRunDate }
    onSave(item)
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} alignItems={'center'} flexDirection={'row'} gap={1} py={4} justifyContent={'center'}>
          <Box display={'flex'} alignItems={'center'} flexDirection={'column'} gap={1}>
            <Box display={'flex'} alignItems={'center'} flexDirection={'row'} gap={2}>
              <ReadOnlyField label='status' />
              <Controller
                name={'status'}
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormDropdownListNumeric options={jobStatusoptions} value={formValues.status} onOptionSelected={onChange} {...field} />
                )}
              ></Controller>
            </Box>
          </Box>
        </Box>
        <Box display={'flex'} alignItems={'center'} flexDirection={'row'} gap={1} py={4} justifyContent={'center'}>
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
        <HorizontalDivider />
        <Box py={2}>
          <PrimaryButton type='submit' text='save' />
        </Box>
      </form>
    </Box>
  )
}

export default EditJobDisplay
