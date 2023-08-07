import { Box, FormLabel, Paper, TextField, Typography } from '@mui/material'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import OnOffSwitch from 'components/Atoms/Inputs/OnOffSwitch'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'components/Molecules/Forms/form'
import { CasinoBlue } from 'components/themes/mainTheme'
import { generateKeyPair } from 'crypto'
import { UserGoal, UserGoalSettings } from 'lib/models/userTasks'
import { cloneDeep } from 'lodash'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { ControlledFreeTextInput } from 'components/Molecules/Forms/ReactHookForm/ControlledFreeTextInput'
import { ControlledDatePicker } from 'components/Molecules/Forms/ReactHookForm/ControlledDatePicker'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

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
    //console.log('submitted: ', newGoal)
  }

  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), {
    goal: goal,
    isSaving: false,
  })

  return (
    <Box pt={2}>
      {model.isSaving && <BackdropLoader />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box py={2}>
          <ControlledFreeTextInput control={control} defaultValue={model.goal.body ?? ''} fieldName='body' label='name' required={true} placeholder='name' />
        </Box>
        <Box py={2}>
          <ControlledDatePicker control={control} defaultValue={model.goal.dueDate ?? ''} fieldName='dueDate' label='due date' placeholder='due date' />
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
    </Box>
    // <Box pt={2}>
    //   {/* <Paper sx={{ padding: 2 }}> */}
    //   <Box maxWidth={{ xs: 280, md: 500 }}>
    //     <Box py={2}>
    //       <FormTextBox
    //         width={'100%'}
    //         defaultValue={model.goal.body ?? ''}
    //         label={'name'}
    //         onChanged={handleGoalBodyChange}
    //         //onBlurred={handleSubmitGoalChanges}
    //         disabled={model.isSaving}
    //         maxLength={50}
    //         required
    //       />
    //     </Box>
    //     <Box py={2}>
    //       <DateAndTimePicker disabled={model.isSaving} onChanged={handleDueDateChange} label={'due date'} defaultValue={goal.dueDate} />
    //     </Box>
    //     {/* <Box py={2}>
    //       <OnOffSwitch isChecked={model.goal.settings?.showCompletedTasks} label={'show completed tasks'} onChanged={handleSetShowComp} />
    //     </Box> */}
    //     <Box py={2} display='flex' gap={2}>
    //       <PassiveButton text={'cancel'} onClick={onCancelEdit} disabled={model.isSaving} />
    //       <SecondaryButton text={'save'} onClick={handleSubmitGoalChanges} disabled={model.isSaving} />
    //     </Box>
    //   </Box>
    //   {/* </Paper> */}
    // </Box>
  )
}

export default EditGoal
