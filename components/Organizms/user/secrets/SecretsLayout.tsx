import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenteredParagraph from 'components/Atoms/Text/CenteredParagraph'
import WarmupBox from 'components/Atoms/WarmupBox'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructUserSecretSecondaryKey } from 'lib/backend/api/aws/util'
import { UserSecret, userSecretArraySchema } from 'lib/backend/api/models/zModels'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import { getUserSecrets } from 'lib/backend/csr/nextApiWrapper'
import { myEncrypt } from 'lib/backend/encryption/useEncryptor'
import { orderBy } from 'lodash'
import React from 'react'
import EditSecret from './EditSecret'
import SecretLayout from './SecretLayout'

interface Model {
  originalSecrets: UserSecret[]
  isLoading: boolean
  createNew: boolean
}

const SecretsLayout = ({ profile, user }: { profile: UserProfile; user: AmplifyUser }) => {
  const encKey = `${user.id}-${profile.username}`
  const defaultModel: Model = {
    isLoading: true,
    originalSecrets: [],
    createNew: false,
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const handleAddItem = async (item: UserSecret) => {
    setModel({ ...model, isLoading: true, createNew: false })
    const result = await loadData()
    setModel({ ...model, isLoading: false, originalSecrets: result, createNew: false })
  }
  const handleDeleteItem = async (id: string) => {
    setModel({ ...model, isLoading: true, createNew: false })
    const result = await loadData()
    setModel({ ...model, isLoading: false, originalSecrets: result, createNew: false })
  }

  const loadData = async () => {
    const dbresult = await getUserSecrets(profile.username)
    const secrets = userSecretArraySchema.parse(dbresult.map((item) => JSON.parse(item.data)))
    return orderBy(secrets, ['title'], ['asc'])
  }

  React.useEffect(() => {
    const fn = async () => {
      const result = await loadData()
      setModel({ ...model, isLoading: false, originalSecrets: result, createNew: false })
    }
    fn()
  }, [])

  return (
    <ResponsiveContainer>
      {model.isLoading ? (
        <WarmupBox text='loading secrets...' />
      ) : (
        <>
          {model.createNew ? (
            <EditSecret
              username={user.email}
              encKey={encKey}
              userSecret={{ title: '', secret: '' }}
              onCancel={() => setModel({ ...model, createNew: false })}
              onSaved={handleAddItem}
              onDeleted={handleDeleteItem}
            />
          ) : (
            <Box pb={3}>
              <SecondaryButton text={'add'} size='small' onClick={() => setModel({ ...model, createNew: true })} />
            </Box>
          )}
          {model.originalSecrets.map((item, i) => (
            <Box key={i}>
              <SecretLayout username={profile.username} encKey={encKey} userSecret={item} onDeleted={handleDeleteItem} />
            </Box>
          ))}
          {model.originalSecrets.length === 0 && <CenteredParagraph text={'You do not have anything saved yet.'} />}
        </>
      )}
    </ResponsiveContainer>
  )
}

export default SecretsLayout
