import { Box, Stack, Typography } from '@mui/material'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ControlledFreeTextInput } from 'components/Molecules/Forms/ReactHookForm/ControlledFreeTextInput'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import DateAndTimePicker2 from 'components/Molecules/Forms/ReactHookForm/DateAndTimePicker2'
import { UserGoal } from './goalModels'
import { useReducer } from 'react'

interface Model {
  goal: UserGoal
  isSaving: boolean
}

const EditGoal = ({
  goal,
  onSaveGoal,
  onShowCompletedTasks,
  onCancelEdit,
}: {
  goal: UserGoal
  onSaveGoal: (item: UserGoal) => void
  onShowCompletedTasks: (show: boolean) => void
  onCancelEdit: () => void
}) => {
  if (!goal.settings) {
    goal.settings = {
      showCompletedTasks: true,
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserGoal>({
    //resolver: zodResolver(FormSchema),
  })

  const onSubmit: SubmitHandler<UserGoal> = (formData: UserGoal) => {
    const newGoal = { ...goal, body: formData.body, dueDate: formData.dueDate, deleteCompletedTasks: formData.deleteCompletedTasks }
    setModel({ ...model, goal: newGoal, isSaving: true })
    onSaveGoal(newGoal)
  }

  const [model, setModel] = useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), {
    goal: goal,
    isSaving: false,
  })

  return (
    <Stack pt={2} flexDirection={'row'} justifyContent={'center'}>
      {model.isSaving && <BackdropLoader />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box py={2}>
          <ControlledFreeTextInput control={control} defaultValue={model.goal.body ?? ''} fieldName='body' label='' required={true} placeholder='name' />
        </Box>
        <Box py={2}>
          <Controller
            name={'dueDate'}
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <DateAndTimePicker2 errorMessage={errors.dueDate?.message} value={value} onDateSelected={onChange} {...field} />
            )}
          />
        </Box>
        <Box py={2}>
          <Box display={'flex'} gap={1} alignItems={'center'}>
            <ControlledSwitch
              control={control}
              defaultValue={model.goal.deleteCompletedTasks === true}
              fieldName='deleteCompletedTasks'
              onChanged={(val: boolean) => {
                const newGoal = { ...model.goal, deleteCompletedTasks: val }
                setModel({ ...model, goal: newGoal })
              }}
            />
            <Typography>automatically delete completed tasks</Typography>
          </Box>
        </Box>
        <Box py={2} display='flex' gap={2}>
          <PassiveButton text={'cancel'} onClick={onCancelEdit} disabled={model.isSaving} />
          <PrimaryButton type='submit' text={'save'} disabled={model.isSaving} />
        </Box>
      </form>
    </Stack>
  )
}

export default EditGoal
