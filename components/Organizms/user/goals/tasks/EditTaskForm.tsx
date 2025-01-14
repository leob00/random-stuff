import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import dayjs from 'dayjs'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import Delete from '@mui/icons-material/Delete'
import DateAndTimePicker2 from '../../../../Molecules/Forms/ReactHookForm/DateAndTimePicker2'
import { UserTask } from '../goalModels'
import { useReducer, useState } from 'react'
import { z } from 'zod'
import S3FileUploadForm from 'components/Molecules/Forms/S3FileUploadForm'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { useUserController } from 'hooks/userController'
import { sortArray } from 'lib/util/collections'
import S3FilesTable from 'components/Organizms/files/S3FilesTable'
import { DropdownItem } from 'lib/models/dropdown'
import { useS3Controller } from 'hooks/s3/useS3Controller'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import CenterStack from 'components/Atoms/CenterStack'
import S3ManageFiles from 'components/Organizms/files/S3ManageFiles'
const TaskSchema = z.object({
  title: z.string(),
})

const EditTaskForm = ({
  task,
  onSubmit,
  onCancel,
  onDelete,
}: {
  task: UserTask
  onSubmit: (data: UserTask, closeEdit?: boolean) => void
  onCancel: () => void
  onDelete: (data: UserTask) => void
}) => {
  const { authProfile } = useUserController()
  const [formInput, setFormInput] = useReducer((state: UserTask, newState: UserTask) => ({ ...state, ...newState }), task)
  const [valid, setValid] = useState(true)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const folder = `${authProfile!.username}/user-tasks/${task.id}`
  const allFolders: DropdownItem[] = [
    {
      text: 'tasks folder',
      value: folder,
    },
  ]

  const handleDueDateChange = (dt: string | null) => {
    setFormInput({ ...formInput, dueDate: dt })
  }
  const handleDateCompletedChange = (dt: string | null) => {
    setFormInput({ ...formInput, dateCompleted: dt })
  }
  const handleTitleChanged = (title: string) => {
    setFormInput({ ...formInput, body: title })
  }

  const handleCancelClick = () => {
    onCancel()
  }

  const trySubmit = () => {
    const isFormValid = formInput.body !== undefined && formInput.body.trim().length > 0 && !formInput.body.includes('  ')

    if (isFormValid) {
      const data = { ...formInput }
      setFormInput({ ...formInput, id: undefined, body: undefined })
      onSubmit(data)
      setValid(true)
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

  const handleFileMutate = (files: S3Object[]) => {
    const newTask = { ...formInput, files: sortArray(files, ['filename'], ['asc']) }
    setFormInput(newTask)
    onSubmit(newTask, false)
  }

  return (
    <Box>
      <form onSubmit={handleFormSubmit}>
        <Box display={'flex'} justifyContent={'center'}>
          <Box minWidth={{ md: 800 }}>
            <Box py={2} maxWidth={{ xs: 280, md: 500 }}>
              <FormTextBox width={'100%'} defaultValue={formInput.body ?? ''} label={'task'} onChanged={handleTitleChanged} error={!valid} />
            </Box>
            <Box py={2}>
              <DateAndTimePicker2 value={formInput.dueDate} onDateSelected={handleDueDateChange} label={'due date'} />
            </Box>
            <Box py={2}>
              <DateAndTimePicker2 value={formInput.dateCompleted} onDateSelected={handleDateCompletedChange} label={'completed date'} />
            </Box>
            <Box py={2}>
              <TextField
                label='notes'
                placeholder='notes...'
                multiline
                sx={{ width: '100%' }}
                defaultValue={formInput.notes}
                onChange={handleNoteChange}
                slotProps={{
                  input: {
                    autoCorrect: 'off',
                  },
                }}
              />
            </Box>
          </Box>
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
      <S3ManageFiles displayName='note files' folderPath={folder} files={formInput.files} onFilesMutated={handleFileMutate} />
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
    </Box>
  )
}

export default EditTaskForm
