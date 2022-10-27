import { Divider } from '@aws-amplify/ui-react'
import { SaveSharp, Cancel, Close, Save } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, TextField } from '@mui/material'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import HtmlEditor from 'components/Atoms/Inputs/HtmlEditor'
import EditItemToolbar from 'components/Molecules/EditItemToolbar'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'
import HtmlEditorQuill from '../../Atoms/Inputs/HtmlEditorQuill'

const EditNote = ({ item, onCanceled, onSubmitted }: { item: UserNote; onCanceled?: () => void; onSubmitted?: (note: UserNote) => void }) => {
  const title = React.useRef<HTMLInputElement | null>(null)
  const [note] = React.useState(item)
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
    //console.log(text)
  }

  return item ? (
    <>
      <EditItemToolbar onSave={handleSave} onCancel={handleCancel} />
      <Box sx={{ pt: 2 }} component='form'>
        <CenterStack sx={{ width: { xs: '100%' } }}>
          <TextField
            fullWidth
            inputRef={title}
            defaultValue={item.title}
            size='small'
            label={'title'}
            placeholder='title'
            //sx={{ width: '50%' }}
            onChange={handleTitleChange}
            required
            error={titleError}
          />
        </CenterStack>
        <CenterStack sx={{ py: 2, minHeight: 480, width: { xs: '100%' } }}>
          <HtmlEditorQuill value={bodyText} onChanged={handleBodyChange} />
        </CenterStack>
        <Box>
          <CenterStack sx={{ py: 2, gap: 2 }}>
            <PrimaryButton onClick={handleSave} text='save' sx={{ ml: 3 }}></PrimaryButton>
            <PassiveButton text={'cancel'} onClick={handleCancel} />
          </CenterStack>
        </Box>
      </Box>
    </>
  ) : (
    <></>
  )
}

export default EditNote
