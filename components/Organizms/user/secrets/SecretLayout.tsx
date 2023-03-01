import { Box, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from '@mui/material'
import theme from 'components/themes/mainTheme'
import { UserSecret } from 'lib/backend/api/models/zModels'
import React from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { myDecrypt, myEncrypt } from 'lib/backend/encryption/useEncryptor'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import EditSecret from './EditSecret'
import EditItemToolbar from 'components/Molecules/EditItemToolbar'
import { Save, Close, Create, Delete } from '@mui/icons-material'
import SecretListItem from './SecretListItem'

export interface SecretViewModel {
  id?: string
  editMode: boolean
  title: string
  isEncrypted: boolean
  secret: string
  copied: boolean
}

const SecretLayout = ({
  username,
  encKey,
  userSecret,
  onDeleted,
}: {
  username: string
  encKey: string
  userSecret: UserSecret
  onDeleted: (id: string) => void
}) => {
  const defaultModel: SecretViewModel = {
    id: userSecret.id,
    editMode: false,
    title: userSecret.title,
    isEncrypted: true,
    secret: userSecret.secret,
    copied: false,
  }
  const [model, setModel] = React.useReducer((state: SecretViewModel, newState: SecretViewModel) => ({ ...state, ...newState }), defaultModel)

  const handleSaved = (item: UserSecret) => {
    // TODO: save
    setModel({ ...model, editMode: false, isEncrypted: true, secret: item.secret, title: item.title, id: item.id })
  }
  const handleDeleted = (id: string) => {
    onDeleted(id)
  }

  return (
    <Box>
      {model.editMode ? (
        <Box>
          <Box py={2}>
            <Box textAlign={'right'}>
              <IconButton color='secondary' onClick={() => setModel({ ...model, editMode: false })}>
                <Close fontSize='small' />
              </IconButton>
            </Box>
            <EditSecret
              username={username}
              encKey={encKey}
              userSecret={userSecret}
              onCancel={() => setModel({ ...model, editMode: false })}
              onSaved={handleSaved}
              onDeleted={handleDeleted}
            />
          </Box>
        </Box>
      ) : (
        <>
          <SecretListItem encKey={encKey} viewModel={model} onEdit={() => setModel({ ...model, editMode: true })} />
        </>
      )}
    </Box>
  )
}

export default SecretLayout
