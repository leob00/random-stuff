import { Box, Button, Checkbox, Stack, Typography } from '@mui/material'
import { UserTask } from 'lib/models/userTasks'
import React from 'react'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import { cloneDeep } from 'lodash'
import CenterStack from 'components/Atoms/CenterStack'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import dayjs from 'dayjs'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import { Delete } from '@mui/icons-material'

const EditTaskForm = ({
  task,
  onSubmit,
  onCancel,
  onDelete,
}: {
  task: UserTask
  onSubmit: (data: UserTask) => void
  onCancel: () => void
  onDelete: (data: UserTask) => void
}) => {
  const [formInput, setFormInput] = React.useReducer((state: UserTask, newState: UserTask) => ({ ...state, ...newState }), task)
  const [valid, setValid] = React.useState(true)
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)

  const handleDueDateChange = (dt?: string) => {
    setFormInput({ ...formInput, dueDate: dt })
  }
  const handleTitleChanged = (title: string) => {
    setFormInput({ ...formInput, body: title })
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
    //console.log(formInput)
    e.preventDefault()
    trySubmit()
  }
  return (
    <form onSubmit={handleFormSubmit}>
      <ConfirmDeleteDialog
        show={showConfirmDelete}
        title={'confirm delete'}
        text={'Are you sure you want to delete this task?'}
        onConfirm={() => {
          onDelete(formInput)
        }}
        onCancel={() => {
          setShowConfirmDelete(false)
        }}
      />
      <Box py={2} maxWidth={{ xs: 280, md: 500 }}>
        <FormTextBox width={'100%'} defaultValue={formInput.body ?? ''} label={'new task'} onChanged={handleTitleChanged} error={!valid} />
      </Box>
      <Box py={2}>
        <DateAndTimePicker
          defaultValue={formInput.dueDate ? dayjs(formInput.dueDate).format() : undefined}
          onChanged={handleDueDateChange}
          label={'due date'}
        />
      </Box>
      <Box py={2}>
        <Stack direction={'row'} display={'flex'} justifyContent={'left'} spacing={1} alignItems={'center'}>
          <Checkbox
            defaultChecked={formInput.status != undefined && formInput.status === 'completed'}
            onChange={(e, checked) => {
              setFormInput({ ...formInput, status: checked ? 'completed' : 'in progress' })
            }}
          />
          <Typography>complete</Typography>
        </Stack>
      </Box>
      <Box py={2}>
        <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
          <Button
            size='small'
            onClick={() => {
              setShowConfirmDelete(true)
            }}
          >
            <Delete color='error' />
          </Button>
          <PassiveButton text='cancel' size='small' onClick={handleCancelClick} />
          <SecondaryButton text='save' type='submit' size='small' />
        </Stack>
      </Box>
    </form>
  )
}

export default EditTaskForm
