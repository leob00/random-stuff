import { Box, IconButton } from '@mui/material'
import { UserSecret } from 'lib/backend/api/models/zModels'
import React from 'react'
import EditSecret from './EditSecret'
import { Close } from '@mui/icons-material'
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
              userSecret={{ ...model, id: model.id, title: model.title, secret: model.secret }}
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