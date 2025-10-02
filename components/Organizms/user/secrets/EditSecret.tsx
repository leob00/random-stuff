import { Box, Stack, Typography } from '@mui/material'
import { UserSecret } from 'lib/backend/api/models/zModels'
import { myEncrypt } from 'lib/backend/encryption/useEncryptor'
import { constructUserSecretPrimaryKey } from 'lib/backend/api/aws/util'
import { deleteRecord, putUserSecret } from 'lib/backend/csr/nextApiWrapper'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import SecretInputForm from './SecretInputForm'
import { useReducer } from 'react'

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
  isDecrypted = false,
}: {
  username: string
  encKey: string
  userSecret: UserSecret
  onCancel: () => void
  onSaved?: (item: UserSecret) => void
  onDeleted: (id: string) => void
  isDecrypted?: boolean
}) => {
  const defaultModel: Model = {
    isLoading: false,
    showConfirmDelete: false,
    userSecret: { ...userSecret, secret: userSecret.secret },
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
        <>
          {isDecrypted ? (
            <SecretInputForm currentValues={model.userSecret} onSubmitted={onSubmitted} onCancel={onCancel} onDelete={handleDeleteClick} />
          ) : (
            <Box>
              <Box display={'flex'} gap={1}>
                <Box flexDirection={'column'} py={0.3}>
                  <Typography variant='body2' textAlign={'right'}>
                    {'secret:'}
                  </Typography>
                </Box>
                <Box flexDirection={'column'}>
                  <Box flexDirection={'column'} py={0.3}>
                    <Typography variant='body2' textAlign={'left'} fontWeight={'bold'}>
                      {model.userSecret.secret}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </>
      </Stack>
    </Box>
  )
}

export default EditSecret
