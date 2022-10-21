import { Box, TextField } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'
import HtmlEditor from '../HtmlEditor'

const EditNote = ({ item, onCanceled, onSubmitted }: { item: UserNote; onCanceled?: () => void; onSubmitted?: (note: UserNote) => void }) => {
  const title = React.useRef<HTMLInputElement | null>(null)
  const [note] = React.useState(item)
  const [bodyText, setBodyText] = React.useState(item.body)
  const [titleError, setTitleError] = React.useState(false)

  const handleCancelClick = () => {
    onCanceled?.()
  }
  const handleSave = async () => {
    setTitleError(false)
    if (title.current && title.current.value.trim().length === 0) {
      setTitleError(true)
      return
    }
    note.title = title.current ? title.current.value : ''
    note.body = bodyText
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
    <Box sx={{ py: 2 }} component='form'>
      <CenterStack>
        <TextField
          inputRef={title}
          defaultValue={item.title}
          size='small'
          label={'title'}
          placeholder='title'
          sx={{ width: '50%' }}
          onChange={handleTitleChange}
          required
          error={titleError}
        />
      </CenterStack>
      <CenterStack sx={{ py: 2, minHeight: 280 }}>
        <HtmlEditor value={bodyText} onChanged={handleBodyChange} />
      </CenterStack>

      <CenterStack sx={{ py: 2, gap: 2 }}>
        <SecondaryButton text={'cancel'} onClick={handleCancelClick} />
        <PrimaryButton onClick={handleSave} text='save' sx={{ ml: 3 }}></PrimaryButton>
      </CenterStack>
    </Box>
  ) : (
    <></>
  )
}

export default EditNote
