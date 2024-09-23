import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import DateAndTimePicker2 from 'components/Molecules/Forms/ReactHookForm/DateAndTimePicker2'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import dayjs from 'dayjs'
import { Job } from 'lib/backend/api/qln/qlnApi'
import { DropdownItemNumeric } from 'lib/models/dropdown'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const JobFormSchema = z.object({
  nextRunDate: z
    .string()
    .nullable()
    .refine((val) => !val || dayjs(val).isValid(), { message: 'Invalid Date' }),
  status: z.number(),
  //.refine((val) => !val || val && , { message: 'Folder already exists' }),
})
type JobFields = z.infer<typeof JobFormSchema>

const EditJobDisplay = ({ data, onSave }: { data: Job; onSave: (item: Job) => void }) => {
  const [showSavedSnackbar, setShowSavedSnackbar] = useState(false)
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
    setShowSavedSnackbar(true)
    const item = { ...data, Status: formData.status, NextRunDate: dayjs(formData.nextRunDate).format('YYYY-MM-DD HH:mm:ss') }
    onSave(item)
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} alignItems={'center'} flexDirection={'row'} gap={1} py={4} justifyContent={'center'}>
          <Box display={'flex'} alignItems={'center'} flexDirection={'column'} gap={4}>
            <Box>
              <Controller
                name={'status'}
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormDropdownListNumeric
                    minWidth={300}
                    label='status'
                    options={jobStatusoptions}
                    value={formValues.status}
                    onOptionSelected={onChange}
                    {...field}
                  />
                )}
              ></Controller>
            </Box>
            <Box>
              <Controller
                name={'nextRunDate'}
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <DateAndTimePicker2
                    label={'next run date'}
                    value={formValues.nextRunDate}
                    errorMessage={errors.nextRunDate?.message}
                    onDateSelected={onChange}
                    {...field}
                  />
                )}
              ></Controller>
            </Box>
          </Box>
        </Box>

        <HorizontalDivider />
        <Box py={2} alignItems={'center'} justifyContent={'center'} display={'flex'}>
          <PrimaryButton type='submit' text='save' />
        </Box>
      </form>
      {showSavedSnackbar && <SnackbarSuccess text='job saved!' show={showSavedSnackbar} onClose={() => setShowSavedSnackbar(false)} />}
    </Box>
  )
}

export default EditJobDisplay
