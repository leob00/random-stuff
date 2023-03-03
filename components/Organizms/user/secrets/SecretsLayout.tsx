import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import CenteredParagraph from 'components/Atoms/Text/CenteredParagraph'
import WarmupBox from 'components/Atoms/WarmupBox'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { UserSecret, userSecretArraySchema } from 'lib/backend/api/models/zModels'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import { getUserSecrets } from 'lib/backend/csr/nextApiWrapper'
import { getGuid, myEncrypt } from 'lib/backend/encryption/useEncryptor'
import { orderBy } from 'lodash'
import React from 'react'
import EditSecret from './EditSecret'
import SecretLayout from './SecretLayout'

interface Model {
  originalSecrets: UserSecret[]
  filteredSecrets: UserSecret[]
  filter: string
  isLoading: boolean
  createNew: boolean
}

const SecretsLayout = ({ profile, user }: { profile: UserProfile; user: AmplifyUser }) => {
  const encKey = `${user.id}-${profile.username}`
  const defaultModel: Model = {
    isLoading: true,
    originalSecrets: [],
    filteredSecrets: [],
    filter: '',
    createNew: false,
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)
  const applyFilter = (list: UserSecret[], filter: string) => {
    return list.filter((o) => o.title.toLowerCase().includes(filter.toLowerCase()))
  }
  const handleItemAdded = async (item: UserSecret) => {
    setModel({ ...model, isLoading: true, createNew: false })
    const result = await loadData()
    setModel({ ...model, isLoading: false, originalSecrets: result, filteredSecrets: applyFilter(result, model.filter), createNew: false })
  }
  const handleItemDeleted = async (id: string) => {
    setModel({ ...model, isLoading: true, createNew: false })
    const result = await loadData()
    setModel({ ...model, isLoading: false, originalSecrets: result, filteredSecrets: result, filter: '', createNew: false })
  }

  const getRandomSalt = () => {
    return myEncrypt(getGuid().split('').reverse().join(''), getGuid().split('').reverse().join('')).split('').reverse().join('')
  }

  const loadData = async () => {
    const dbresult = await getUserSecrets(profile.username)
    const secrets = userSecretArraySchema.parse(dbresult.map((item) => JSON.parse(item.data)))
    secrets.forEach((item) => {
      if (!item.salt) {
        item.salt = getRandomSalt()
      }
    })
    return orderBy(secrets, ['title'], ['asc'])
  }
  const handleFilterChanged = async (text: string) => {
    setModel({ ...model, filteredSecrets: applyFilter(model.originalSecrets, text), filter: text })
  }

  React.useEffect(() => {
    const fn = async () => {
      const result = await loadData()
      setModel({ ...model, isLoading: false, originalSecrets: result, filteredSecrets: applyFilter(result, model.filter), createNew: false })
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
              userSecret={{ title: '', secret: '', salt: getRandomSalt() }}
              onCancel={() => setModel({ ...model, createNew: false })}
              onSaved={handleItemAdded}
              onDeleted={handleItemDeleted}
            />
          ) : (
            <Box pb={3}>
              <SecondaryButton text={'add'} size='small' onClick={() => setModel({ ...model, createNew: true })} />
            </Box>
          )}

          <Box py={2}>
            <CenterStack>
              <SearchWithinList onChanged={handleFilterChanged} defaultValue={model.filter} />
            </CenterStack>
          </Box>

          {model.filteredSecrets.map((item, i) => (
            <Box key={item.id}>
              <SecretLayout username={profile.username} encKey={encKey} userSecret={item} onDeleted={handleItemDeleted} />
            </Box>
          ))}
          {model.filteredSecrets.length === 0 && <CenteredParagraph text={'No secrets found.'} />}
        </>
      )}
    </ResponsiveContainer>
  )
}

export default SecretsLayout
