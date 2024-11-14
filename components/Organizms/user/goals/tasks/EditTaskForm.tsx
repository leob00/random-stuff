import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import { cloneDeep } from 'lodash'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import dayjs from 'dayjs'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import Delete from '@mui/icons-material/Delete'
import { getUtcNow } from 'lib/util/dateUtil'
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
  onSubmit: (data: UserTask) => void
  onCancel: () => void
  onDelete: (data: UserTask) => void
}) => {
  const { authProfile } = useUserController()
  const [formInput, setFormInput] = useReducer((state: UserTask, newState: UserTask) => ({ ...state, ...newState }), task)
  const [valid, setValid] = useState(true)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const s3Controller = useS3Controller()
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

  const handleUploaded = (file: S3Object) => {
    const newFiles = formInput.files ?? []
    newFiles.push(file)
    setFormInput({ ...formInput, files: sortArray(newFiles, ['filename'], ['asc']) })
  }

  const handleReloadFolder = async (f: DropdownItem) => {}

  const handleFileMutate = (f: DropdownItem, files: S3Object[]) => {
    if (files.length > 0) {
      setFormInput({ ...formInput, files: sortArray(files, ['filename'], ['asc']) })
    } else {
      setFormInput({ ...formInput, files: undefined })
    }
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
              <DateAndTimePicker2
                value={formInput.dueDate ? dayjs(formInput.dueDate).format() : undefined}
                onDateSelected={handleDueDateChange}
                label={'due date'}
              />
            </Box>
            <Box py={2}>
              <DateAndTimePicker2
                value={formInput.dateCompleted ? dayjs(formInput.dueDate).format() : undefined}
                onDateSelected={handleDateCompletedChange}
                label={'completed date'}
              />
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
        {formInput.files && formInput.files.length > 0 && (
          <>
            <CenteredHeader title='files' />
            <S3FilesTable
              allFolders={allFolders}
              folder={{ text: 'tasks-folder', value: folder }}
              data={formInput.files ?? []}
              s3Controller={s3Controller}
              onLocalDataMutate={handleFileMutate}
              onReloadFolder={handleReloadFolder}
              showTableHeader={false}
            />
          </>
        )}
        <S3FileUploadForm files={formInput.files ?? []} folder={folder} onUploaded={handleUploaded} />
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
