import { Box, Button, FormGroup, Stack } from '@mui/material'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import { UserSecret, userSecretArraySchema } from 'lib/backend/api/models/zModels'
import { myDecrypt, myEncrypt } from 'lib/backend/encryption/useEncryptor'
import React from 'react'
import FormControl from '@mui/material/FormControl'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import { constructUserSecretPrimaryKey } from 'lib/backend/api/aws/util'
import { deleteRecord, putUserNote, putUserSecret } from 'lib/backend/csr/nextApiWrapper'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import { Delete } from '@mui/icons-material'

const EditSecret = ({
  username,
  encKey,
  userSecret,
  onCancel,
  onSaved,
  onDeleted,
}: {
  username: string
  encKey: string
  userSecret: UserSecret
  onCancel: () => void
  onSaved: (item: UserSecret) => void
  onDeleted: (id: string) => void
}) => {
  const defaultModel = { ...userSecret, secret: myDecrypt(encKey, userSecret.secret) }
  const [model, setModel] = React.useReducer((state: UserSecret, newState: UserSecret) => ({ ...state, ...newState }), defaultModel)

  const handleTitleChange = (text: string) => {
    setModel({ ...model, title: text })
  }
  const handleSecretChange = (text: string) => {
    setModel({ ...model, secret: text })
  }
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const obj = userSecretArraySchema.element.safeParse(model)
    if (obj.success) {
      const item = { ...model }
      //console.log('submitted: ', item)
      if (!item.id) {
        item.id = constructUserSecretPrimaryKey(username)
      }
      item.secret = myEncrypt(encKey, item.secret)
      await putUserSecret(item, username)
      onSaved(item)
    }
    //const isValid = model.title.trim().length > 0 && model.secret.trim().length > 0
  }
  const handleDeleteClick = async () => {
    const item = { ...model }
    if (item.id) {
      await deleteRecord(item.id)
    }
    onDeleted(item.id!)
  }

  return (
    <Box>
      <Stack>
        <form onSubmit={handleFormSubmit}>
          <FormGroup sx={{ alignItems: 'center' }}>
            <FormControl sx={{ paddingBottom: 2 }}>
              <FormTextBox defaultValue={model.title} label={'title'} onChanged={handleTitleChange} />
            </FormControl>
            <FormControl sx={{ paddingBottom: 2 }}>
              <FormTextBox defaultValue={model.secret} label={'secret'} onChanged={handleSecretChange} />
            </FormControl>
          </FormGroup>
          <FormGroup sx={{ alignItems: 'center' }}>
            <Stack direction='row' spacing={1}>
              {model.id && (
                <Button
                  size='small'
                  onClick={() => {
                    handleDeleteClick()
                  }}
                >
                  <Delete color='error' />
                </Button>
              )}
              <PassiveButton text={'cancel'} onClick={onCancel} size='small' width={90} sx={{ mr: 2 }} />
              <SecondaryButton text='save' type='submit' size='small' width={90} />
            </Stack>
          </FormGroup>
        </form>
      </Stack>
    </Box>
  )
}

export default EditSecret
