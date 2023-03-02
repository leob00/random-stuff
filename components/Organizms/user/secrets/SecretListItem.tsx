import { Create } from '@mui/icons-material'
import { Box, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { myDecrypt, myEncrypt } from 'lib/backend/encryption/useEncryptor'
import React from 'react'
import { SecretViewModel } from './SecretLayout'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

const SecretListItem = ({ encKey, viewModel, onEdit }: { encKey: string; viewModel: SecretViewModel; onEdit: () => void }) => {
  const textRef = React.useRef<HTMLInputElement | null>(null)
  const [model, setModel] = React.useReducer((state: SecretViewModel, newState: SecretViewModel) => ({ ...state, ...newState }), { ...viewModel })

  const handleEncryptDecrypt = () => {
    let val = { ...model }.secret
    if (model.isEncrypted) {
      val = myDecrypt(encKey, model.secret)
    } else {
      val = myEncrypt(encKey, model.secret)
    }
    if (textRef.current) {
      textRef.current.value = val
    }
    setModel({ ...model, isEncrypted: !model.isEncrypted, secret: val, copied: false })
  }
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
            //label='secret'
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
                  <IconButton edge='end' onClick={handleEncryptDecrypt} size='small' color='secondary'>
                    <>
                      {model.isEncrypted ? (
                        <VisibilityIcon fontSize='small' />
                      ) : (
                        <>
                          <VisibilityOffIcon fontSize='small' />
                        </>
                      )}
                    </>
                  </IconButton>
                  <IconButton edge='end' onClick={handleDecryptCopy} size='small' color='secondary'>
                    <Tooltip title={'decrypt and copy'} placement='top' arrow>
                      <ContentCopyIcon fontSize='small' />
                    </Tooltip>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          ></TextField>
        </Stack>
        <Stack>
          <Stack pl={2}>
            <IconButton onClick={handleEditClick} color='secondary' size='small'>
              <Create />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <Box>
        {model.copied && (
          <Box py={1} pr={5}>
            <Typography textAlign={'right'}>copied!</Typography>
          </Box>
        )}
      </Box>
    </>
  )
}

export default SecretListItem
