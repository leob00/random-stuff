import { Box, Button, FormGroup, Stack } from '@mui/material'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import { UserSecret, userSecretArraySchema } from 'lib/backend/api/models/zModels'
import { myDecrypt, myEncrypt } from 'lib/backend/encryption/useEncryptor'
import React from 'react'
import FormControl from '@mui/material/FormControl'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import { constructUserSecretPrimaryKey } from 'lib/backend/api/aws/util'
import { deleteRecord, putUserSecret } from 'lib/backend/csr/nextApiWrapper'
import { Delete } from '@mui/icons-material'
import WarmupBox from 'components/Atoms/WarmupBox'

interface Model {
  isLoading: boolean
  userSecret: UserSecret
}

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
  const defaultModel: Model = {
    isLoading: false,
    userSecret: { ...userSecret, secret: myDecrypt(encKey, userSecret.secret) },
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const handleTitleChange = (text: string) => {
    setModel({ ...model, userSecret: { ...model.userSecret, title: text } })
  }
  const handleSecretChange = (text: string) => {
    setModel({ ...model, userSecret: { ...model.userSecret, secret: text } })
  }
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const obj = userSecretArraySchema.element.safeParse(model.userSecret)
    if (obj.success) {
      setModel({ ...model, isLoading: true })
      const item = { ...model.userSecret }
      if (!item.id) {
        item.id = constructUserSecretPrimaryKey(username)
      }
      item.secret = myEncrypt(encKey, item.secret)
      await putUserSecret(item, username)
      setModel({ ...model, isLoading: false })
      //alert(model.secret)
      onSaved(item)
    } else {
      throw 'failed to parse item'
    }
    //const isValid = model.title.trim().length > 0 && model.secret.trim().length > 0
  }
  const handleDeleteClick = async () => {
    const item = { ...model.userSecret }
    if (item.id) {
      await deleteRecord(item.id)
    }
    onDeleted(item.id!)
  }

  return (
    <Box>
      <Stack>
        <form onSubmit={handleFormSubmit}>
          {model.isLoading ? (
            <WarmupBox />
          ) : (
            <>
              <FormGroup sx={{ alignItems: 'center' }}>
                <FormControl sx={{ paddingBottom: 2 }}>
                  <FormTextBox defaultValue={model.userSecret.title} label={'name'} maxLength={50} onChanged={handleTitleChange} />
                </FormControl>
                <FormControl sx={{ paddingBottom: 2 }}>
                  <FormTextBox defaultValue={model.userSecret.secret} label={'secret'} onChanged={handleSecretChange} />
                </FormControl>
              </FormGroup>
              <FormGroup sx={{ alignItems: 'center' }}>
                <Stack direction='row' spacing={1}>
                  {model.userSecret.id && (
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
            </>
          )}
        </form>
      </Stack>
    </Box>
  )
}

export default EditSecret
