import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { UserTask } from 'lib/models/userTasks'
import React from 'react'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import { cloneDeep } from 'lodash'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import dayjs from 'dayjs'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import Delete from '@mui/icons-material/Delete'
import { getUtcNow } from 'lib/util/dateUtil'
import DateAndTimePicker2 from './ReactHookForm/DateAndTimePicker2'

const EditTaskForm = ({ task, onSubmit, onCancel, onDelete }: { task: UserTask; onSubmit: (data: UserTask) => void; onCancel: () => void; onDelete: (data: UserTask) => void }) => {
  const [formInput, setFormInput] = React.useReducer((state: UserTask, newState: UserTask) => ({ ...state, ...newState }), task)
  const [valid, setValid] = React.useState(true)
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)

  const handleDueDateChange = (dt: string | null) => {
    setFormInput({ ...formInput, dueDate: dt })
  }
  const handleTitleChanged = (title: string) => {
    setFormInput({ ...formInput, body: title })
  }

  const handleCompletedChecked = (checked: boolean) => {
    const status = checked ? 'completed' : 'in progress'
    const dateCompleted = checked ? getUtcNow().format() : undefined

    setFormInput({ ...formInput, status: status, dateCompleted: dateCompleted })
  }

  const handleCancelClick = () => {
    onCancel()
  }

  const trySubmit = () => {
    const isValid = formInput.body !== undefined && formInput.body.trim().length > 0 && !formInput.body.includes('  ')
    setValid(isValid)
    if (isValid) {
      const data = cloneDeep(formInput)
      setFormInput({ ...formInput, id: undefined, body: undefined })
      onSubmit(data)
    } else {
      setValid(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    trySubmit()
  }

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, notes: event.target.value })
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <Box py={2} maxWidth={{ xs: 280, md: 500 }}>
          <FormTextBox width={'100%'} defaultValue={formInput.body ?? ''} label={'task'} onChanged={handleTitleChanged} error={!valid} />
        </Box>
        <Box py={2}>
          <DateAndTimePicker2 value={formInput.dueDate ? dayjs(formInput.dueDate).format() : undefined} onDateSelected={handleDueDateChange} label={'due date'} />
        </Box>
        <Box py={2}>
          <TextField label='notes' placeholder='notes...' multiline sx={{ width: '100%' }} defaultValue={formInput.notes} onChange={handleNoteChange} inputProps={{ maxLength: 500 }} />
        </Box>
        <Box py={2}>
          <Stack direction={'row'} display={'flex'} justifyContent={'left'} alignItems={'center'}>
            <SecondaryCheckbox checked={formInput.status != undefined && formInput.status === 'completed'} onChanged={handleCompletedChecked} />
            {formInput.dateCompleted ? <Typography variant='body2'>{`completed: ${dayjs(formInput.dateCompleted).format('MM/DD/YYYY hh:mm A')}`}</Typography> : <Typography variant='body2'>complete</Typography>}
          </Stack>
        </Box>
        <Box py={2}>
          <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
            <Button
              size='small'
              onClick={() => {
                setShowConfirmDelete(true)
              }}>
              <Delete color='error' />
            </Button>
            <PassiveButton text='cancel' size='small' onClick={handleCancelClick} />
            <SecondaryButton text='save' type='submit' size='small' />
          </Stack>
        </Box>
      </form>
      <ConfirmDeleteDialog
        show={showConfirmDelete}
        title={'confirm delete'}
        text={`Are you sure you want to delete ${formInput.body}?`}
        onConfirm={() => {
          setShowConfirmDelete(false)
          onDelete(formInput)
        }}
        onCancel={() => {
          setShowConfirmDelete(false)
        }}
      />
    </>
  )
}

export default EditTaskForm
