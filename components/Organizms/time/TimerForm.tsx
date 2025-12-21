import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import FormNumericTextField2 from 'components/Molecules/Forms/ReactHookForm/FormNumericTextField2'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'

const TimerSettingsSchema = z.object({
  hours: z.number().min(0).max(24).optional(),
  minutes: z.number().min(0).max(60).optional(),
  seconds: z.number().min(0).max(60).optional(),
})

export type TimerSettingsFilter = z.infer<typeof TimerSettingsSchema>

const TimerForm = ({ onSubmitted }: { onSubmitted: (data: TimerSettingsFilter) => void }) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TimerSettingsFilter>({
    resolver: zodResolver(TimerSettingsSchema),
    mode: 'onChange',
    //defaultValues: filter,
  })

  const formValues = watch()

  const onSubmit: SubmitHandler<TimerSettingsFilter> = async (formData) => {
    const submitData = { ...formData }
    onSubmitted(submitData)
  }

  return (
    <Box minHeight={300}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Box display={'flex'} justifyContent={'center'}>
            <Box width={100}>
              <Controller
                name={'hours'}
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormNumericTextField2
                    //placeholder='from'
                    label='hours'
                    size='small'
                    value={formValues.hours}
                    onChanged={(val?: number) => {
                      setValue('hours', val)
                    }}
                    {...field}
                    errorMessage={errors.hours?.message}
                  />
                )}
              />
            </Box>
          </Box>
          <Box display={'flex'} justifyContent={'center'}>
            <Box width={100}>
              <Controller
                name={'minutes'}
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormNumericTextField2
                    //placeholder='from'
                    label='minutes'
                    size='small'
                    value={formValues.minutes}
                    onChanged={(val?: number) => {
                      setValue('minutes', val)
                    }}
                    {...field}
                    errorMessage={errors.minutes?.message}
                  />
                )}
              />
            </Box>
          </Box>
          <Box display={'flex'} justifyContent={'center'}>
            <Box width={100}>
              <Controller
                name={'seconds'}
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormNumericTextField2
                    //placeholder='from'
                    label='seconds'
                    size='small'
                    value={formValues.seconds}
                    onChanged={(val?: number) => {
                      setValue('seconds', val)
                    }}
                    {...field}
                    errorMessage={errors.seconds?.message}
                  />
                )}
              />
            </Box>
          </Box>
          <Box display={'flex'} justifyContent={'center'}>
            <Box width={100}>
              <PrimaryButton type='submit' text='start' />
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default TimerForm
