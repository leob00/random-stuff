import { Box, TextField, Button, FormControl } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { UserNote } from 'lib/models/randomStuffModels'
import { getUtcNow } from 'lib/util/dateUtil'
import React from 'react'

const EditNote = ({ item, onCanceled, onSubmitted }: { item: UserNote; onCanceled?: () => void; onSubmitted?: (note: UserNote) => void }) => {
  const title = React.useRef<HTMLInputElement | null>(null)
  const body = React.useRef<HTMLInputElement | null>(null)
  const [note, setNote] = React.useState(item)

  const handleCancelClick = () => {
    onCanceled?.()
  }
  const handleSave = async () => {
    //console.log(`title: ${title.current?.value} body: ${body.current?.value}`)
    if (title.current && title.current.value.trim().length === 0) {
      return
    }
    note.title = title.current ? title.current.value : ''
    note.body = body.current ? body.current.value : ''

    onSubmitted?.(note)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handleSave()
  }

  return item ? (
    <form
      onSubmit={(e) => {
        handleSubmit(e)
      }}
    >
      <Box sx={{ py: 2 }}>
        <CenterStack>
          <TextField inputRef={title} defaultValue={item.title} size='small' label={'title'} placeholder='title' sx={{ width: '50%' }} required />
        </CenterStack>
        <CenterStack>
          <TextField inputRef={body} defaultValue={item.body} size='small' label={''} placeholder='title' sx={{ width: '50%' }} />
        </CenterStack>
        <CenterStack sx={{ py: 2 }}>
          <Button sx={{ backgroundColor: CasinoGrayTransparent }} variant='outlined' onClick={handleCancelClick}>
            cancel
          </Button>
          <PrimaryButton onClick={handleSave} text='save' sx={{ ml: 3 }}></PrimaryButton>
        </CenterStack>
      </Box>
    </form>
  ) : (
    <></>
  )
}

export default EditNote
