import Create from '@mui/icons-material/Create'
import { Box, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import React from 'react'
import { SecretViewModel } from './SecretLayout'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'

const SecretListItem = ({ encKey, viewModel, onEdit }: { encKey: string; viewModel: SecretViewModel; onEdit: () => void }) => {
  const textRef = React.useRef<HTMLInputElement | null>(null)
  const [model, setModel] = React.useReducer((state: SecretViewModel, newState: SecretViewModel) => ({ ...state, ...newState }), { ...viewModel })

  const handleDecryptCopy = () => {
    let val = { ...model }.secret
    if (model.isEncrypted) {
      val = myDecrypt(encKey, model.secret)
    }
    navigator.clipboard.writeText(val)
    setModel({ ...model, copied: true })
    setTimeout(() => {
      setModel({ ...model, copied: false })
    }, 3000)
  }

  const handleEditClick = () => {
    setModel({ ...model, editMode: true })
    onEdit()
  }

  return (
    <>
      <Box py={1}>
        <Typography>{model.title}</Typography>
      </Box>
      <Stack direction={'row'} alignItems={'center'} pb={3}>
        <Stack flexGrow={1}>
          <TextField
            variant='standard'
            autoComplete='off'
            defaultValue={model.secret}
            //onChange={handleChange}
            sx={{ borderWidth: 0 }}
            size='small'
            placeholder={'secret'}
            inputRef={textRef}
            InputProps={{
              readOnly: !model.editMode,
              autoComplete: 'off',
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton edge='end' onClick={handleDecryptCopy} size='small' color='primary'>
                    <ContentCopyIcon fontSize='small' />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          ></TextField>
        </Stack>
        <Stack>
          <Stack pl={2}>
            <IconButton onClick={handleEditClick} color='primary' size='small'>
              <Create />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <Box>{model.copied && <SnackbarSuccess show={model.copied} text={'copied!'} duration={2500} />}</Box>
    </>
  )
}

export default SecretListItem
