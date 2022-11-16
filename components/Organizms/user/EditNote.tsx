import { Warning } from '@mui/icons-material'
import { Box, Stack, TextField, Typography } from '@mui/material'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import OnOffSwitch from 'components/Atoms/Inputs/OnOffSwitch'
import EditItemToolbar from 'components/Molecules/EditItemToolbar'
import dayjs from 'dayjs'
import { UserNote } from 'lib/models/randomStuffModels'
import { getUtcNow } from 'lib/util/dateUtil'
import React from 'react'
import HtmlEditorQuill from '../../Atoms/Inputs/HtmlEditorQuill'

const EditNote = ({ item, onCanceled, onSubmitted }: { item: UserNote; onCanceled?: () => void; onSubmitted?: (note: UserNote) => void }) => {
  const title = React.useRef<HTMLInputElement | null>(null)
  const [note, setNote] = React.useState(item)
  const [bodyText, setBodyText] = React.useState(item.body)
  const [titleError, setTitleError] = React.useState(false)

  const handleCancel = () => {
    onCanceled?.()
  }
  const handleSave = async () => {
    setTitleError(false)
    if (title.current && title.current.value.trim().length === 0) {
      setTitleError(true)
      return
    }
    note.title = title.current ? title.current.value : ''
    note.body = bodyText.replace('<br>', '')
    onSubmitted?.(note)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handleSave()
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
    } else {
      setNote({ ...note, expirationDate: getUtcNow().add(3, 'day').format() })
    }
  }

  return item ? (
    <>
      <EditItemToolbar onSave={handleSave} onCancel={handleCancel} />
      <Box sx={{ pt: 2 }} component='form'>
        <CenterStack sx={{ py: 2, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
          {note.expirationDate && (
            <>
              <Typography pr={1}>
                <Warning fontSize='small' color='warning' />
              </Typography>
              <Typography pr={1} variant='body2'>{`this note is set to expire on ${dayjs(note.expirationDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
            </>
          )}
          <Typography pl={2}>
            <OnOffSwitch isChecked={note.expirationDate !== undefined} label={'expiration'} onChanged={handleExpirationChange} />
          </Typography>
        </CenterStack>
        <CenterStack sx={{ width: { xs: '100%' } }}>
          <TextField
            color='secondary'
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
            <PassiveButton text={'cancel'} onClick={handleCancel} size='small' width={70} />
          </CenterStack>
        </Box>
      </Box>
    </>
  ) : (
    <></>
  )
}

export default EditNote
