import { Warning } from '@mui/icons-material'
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
import { UserNote } from 'lib/models/randomStuffModels'
import { getUtcNow } from 'lib/util/dateUtil'
import React, { MutableRefObject } from 'react'
import HtmlEditorQuill from '../../Atoms/Inputs/HtmlEditorQuill'

const EditNote = ({ item, onCanceled, onSubmitted }: { item: UserNote; onCanceled?: () => void; onSubmitted?: (note: UserNote) => void }) => {
  const title = React.useRef<HTMLInputElement | null>(null)
  const [note, setNote] = React.useState(item)
  const [bodyText, setBodyText] = React.useState(item.body)
  const [titleError, setTitleError] = React.useState(false)
  const [showExpForm, setShowExpForm] = React.useState(false)
  const [editedExpDate, setEditedExpDate] = React.useState<string | undefined>(item.expirationDate)

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
      setEditedExpDate(getUtcNow().add(3, 'day').format())
      setShowExpForm(true)

      //setNote({ ...note, expirationDate: getUtcNow().add(3, 'day').format() })
    }
  }
  const handleCancelExp = () => {
    setShowExpForm(false)
  }
  const handleChangeExp = (val: string) => {
    const dt = dayjs().add(Number(val), 'day').format()
    console.log('new exp date', dt)
    setEditedExpDate(dt)
  }
  const handleSaveExp = () => {
    setNote({ ...note, expirationDate: editedExpDate })
    setShowExpForm(false)
    //const dt = dayjs(note.expirationDate).add(Number(val), 'day')
    //console.log('new exp date')
    //console.log('exp: ', exp)
    //const exp
  }

  const handleEditExp = () => {
    const dt = note.expirationDate
    if (!dt) {
      setNote({ ...note, expirationDate: getUtcNow().add(3, 'day').format() })
    } else {
      setEditedExpDate(note.expirationDate)
    }
    setShowExpForm(true)
  }

  return item ? (
    <>
      <EditItemToolbar onSave={handleSave} onCancel={handleCancel} />
      <FormDialog show={showExpForm} onCancel={handleCancelExp} title='Set expiration' onSave={handleSaveExp}>
        <>
          <DropdownList
            options={[
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
            ]}
            selectedOption={'3'}
            onOptionSelected={handleChangeExp}
          />
          <CenterStack sx={{ py: 4, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <RecordExpirationWarning expirationDate={editedExpDate} />
          </CenterStack>
        </>
      </FormDialog>
      <Box sx={{ pt: 2 }} component='form'>
        <CenterStack sx={{ py: 2, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
          {note.expirationDate && (
            <Button onClick={handleEditExp}>
              <RecordExpirationWarning expirationDate={note.expirationDate} />
            </Button>
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
