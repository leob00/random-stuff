import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import OnOffSwitch from 'components/Atoms/Inputs/OnOffSwitch'
import RecordExpirationWarning from 'components/Atoms/Text/RecordExpirationWarning'
import EditItemToolbar from 'components/Molecules/EditItemToolbar'
import dayjs from 'dayjs'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getUtcNow } from 'lib/util/dateUtil'
import HtmlEditorQuill from '../../Atoms/Inputs/HtmlEditorQuill'
import { DropdownItem } from 'lib/models/dropdown'
import { useRef, useState } from 'react'

const EditNote = ({ item, onCanceled, onSubmitted }: { item: UserNote; onCanceled?: () => void; onSubmitted?: (note: UserNote) => void }) => {
  const title = useRef<HTMLInputElement | null>(null)
  const [note, setNote] = useState(item)
  const [bodyText, setBodyText] = useState(item.body)
  const [titleError, setTitleError] = useState(false)
  const [showExpForm, setShowExpForm] = useState(false)
  const [editedExpDate, setEditedExpDate] = useState<string | undefined>(item.expirationDate)

  const handleCancel = () => {
    onCanceled?.()
  }
  const handleSave = async () => {
    setTitleError(false)
    if (title.current && title.current.value.trim().length === 0) {
      setTitleError(true)
      return
    }
    const noteCopy = { ...note }
    noteCopy.title = title.current ? title.current.value : ''
    noteCopy.body = bodyText.replace('<br>', '')
    noteCopy.body = noteCopy.body.replace('<p class="ql-align-justify"></p>', '<p>')
    onSubmitted?.(noteCopy)
  }

  const handleTitleChange = () => {
    if (title.current) {
      setTitleError(title.current && title.current.value.trim().length === 0)
    }
  }
  const handleBodyChange = (text: string) => {
    setBodyText(text)
  }

  const handleExpirationChange = (checked: boolean) => {
    if (!checked) {
      setNote({ ...note, expirationDate: undefined })
      setEditedExpDate(undefined)
    } else {
      setEditedExpDate(getUtcNow().add(3, 'day').add(1, 'minute').format())
      setShowExpForm(true)

      //setNote({ ...note, expirationDate: getUtcNow().add(3, 'day').format() })
    }
  }
  const handleCancelExp = () => {
    setShowExpForm(false)
  }
  const handleChangeExp = (val: string) => {
    const dt = dayjs().add(Number(val), 'day').add(1, 'minute').format()
    setEditedExpDate(dt)
  }
  const handleSaveExp = () => {
    const dt = editedExpDate ? editedExpDate : getUtcNow().add(3, 'day').add(1, 'minute').format()
    setNote({ ...note, expirationDate: dt })
    setShowExpForm(false)
  }

  const handleEditExp = () => {
    const dt = note.expirationDate
    const newDt = getUtcNow().add(3, 'day').add(1, 'minute').format()
    if (!dt) {
      setNote({ ...note, expirationDate: newDt })
      setEditedExpDate(newDt)
    } else {
      setEditedExpDate(newDt)
    }
    setShowExpForm(true)
  }

  const expOptions: DropdownItem[] = [
    {
      text: '1 day',
      value: '1',
    },
    {
      text: '2 days',
      value: '2',
    },
    {
      text: '3 days',
      value: '3',
    },
    {
      text: '5 days',
      value: '5',
    },
    {
      text: '10 days',
      value: '10',
    },
    {
      text: '1 month',
      value: '30',
    },
  ]

  return item ? (
    <>
      {/* <EditItemToolbar onSave={handleSave} onCancel={handleCancel} /> */}
      <Box>
        <CenterStack sx={{ py: 2, gap: 2 }}>
          <SecondaryButton onClick={handleSave} text='save' sx={{ ml: 3 }} size='small' width={70} />
          <PassiveButton text={'close'} onClick={handleCancel} size='small' width={70} />
        </CenterStack>
      </Box>
      <FormDialog show={showExpForm} onCancel={handleCancelExp} title='Set expiration' onSave={handleSaveExp}>
        <>
          <DropdownList options={expOptions} selectedOption={'3'} onOptionSelected={handleChangeExp} />
          <CenterStack sx={{ py: 4, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            {editedExpDate && <RecordExpirationWarning expirationDate={editedExpDate} precise={true} />}
          </CenterStack>
        </>
      </FormDialog>
      <Box sx={{ pt: 2 }} component='form'>
        <CenterStack sx={{ py: 1, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
          {note.expirationDate && (
            <CenterStack>
              <Stack sx={{ py: 4 }} display={'flex'} direction={'row'} justifyItems={'center'}>
                <Button onClick={handleEditExp}>
                  <RecordExpirationWarning expirationDate={note.expirationDate} />
                </Button>
              </Stack>
            </CenterStack>
          )}
          <Stack display={'flex'} direction={'row'} justifyItems={'center'} alignItems={'center'}>
            <Typography pl={2}>
              <OnOffSwitch isChecked={note.expirationDate !== undefined} label={'expiration'} onChanged={handleExpirationChange} />
            </Typography>
          </Stack>
        </CenterStack>
        <CenterStack sx={{ width: { xs: '100%' } }}>
          <TextField
            inputProps={{ maxLength: 150 }}
            fullWidth
            inputRef={title}
            defaultValue={item.title}
            size='small'
            label={'title'}
            placeholder='title'
            onChange={handleTitleChange}
            required
            error={titleError}
            sx={{ color: 'secondary' }}
          />
        </CenterStack>
        <CenterStack sx={{ py: 2, minHeight: 480, width: { xs: '100%' } }}>
          <HtmlEditorQuill value={bodyText} onChanged={handleBodyChange} />
        </CenterStack>
        <Box>
          <CenterStack sx={{ py: 2, gap: 2 }}>
            <SecondaryButton onClick={handleSave} text='save' sx={{ ml: 3 }} size='small' width={70} />
            <PassiveButton text={'close'} onClick={handleCancel} size='small' width={70} />
          </CenterStack>
        </Box>
      </Box>
      {/* {item.attachments && (
        <Box>
          <CenteredTitle title={'files'} />
          <S3FilesTable data={item.attachments} />
        </Box>
      )} */}
    </>
  ) : (
    <></>
  )
}

export default EditNote
