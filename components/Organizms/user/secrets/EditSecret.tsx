import { Box, Stack } from '@mui/material'
import { UserSecret } from 'lib/backend/api/models/zModels'
import { myDecrypt, myEncrypt, weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { constructUserSecretPrimaryKey } from 'lib/backend/api/aws/util'
import { deleteRecord, putUserSecret } from 'lib/backend/csr/nextApiWrapper'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import SecretInputForm from './SecretInputForm'
import { useEffect, useReducer } from 'react'

interface Model {
  isLoading: boolean
  userSecret: UserSecret
  showConfirmDelete: boolean
}

const EditSecret = ({
  username,
  encKey,
  userSecret,
  onCancel,
  onSaved,
  onDeleted,
  isNew,
}: {
  username: string
  encKey: string
  userSecret: UserSecret
  onCancel: () => void
  onSaved?: (item: UserSecret) => void
  onDeleted: (id: string) => void
  isNew?: boolean
}) => {
  const defaultModel: Model = {
    isLoading: false,
    showConfirmDelete: false,
    userSecret: { ...userSecret, secret: myDecrypt(encKey, userSecret.secret) },
  }

  const [model, setModel] = useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const handleDeleteClick = async () => {
    setModel({ ...model, showConfirmDelete: true })
  }
  const handleYesDelete = async () => {
    setModel({ ...model, showConfirmDelete: false, isLoading: true })
    const item = { ...model.userSecret }
    if (item.id) {
      await deleteRecord(item.id)
    }
    onDeleted(item.id!)
  }

  const onSubmitted = async (data: UserSecret) => {
    setModel({ ...model, isLoading: true })

    if (!data.id) {
      data.id = constructUserSecretPrimaryKey(username)
    }
    data.secret = myEncrypt(encKey, data.secret)
    await putUserSecret(data, username)

    onSaved?.(data)
  }

  return (
    <Box>
      <ConfirmDeleteDialog
        show={model.showConfirmDelete}
        text={`Are you sure you want to delete ${model.userSecret.title}?`}
        onCancel={() => setModel({ ...model, showConfirmDelete: false })}
        onConfirm={handleYesDelete}
      />
      <Stack>
        {model.isLoading ? (
          <BackdropLoader />
        ) : (
          <>
            <SecretInputForm currentValues={model.userSecret} onSubmitted={onSubmitted} onCancel={onCancel} onDelete={handleDeleteClick} />
          </>
        )}
      </Stack>
    </Box>
  )
}

export default EditSecret
