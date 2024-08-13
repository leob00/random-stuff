import { Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CenteredParagraph from 'components/Atoms/Text/CenteredParagraph'
import RequirePin from 'components/Organizms/Login/RequirePin'
import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { UserSecret, userSecretArraySchema } from 'lib/backend/api/models/zModels'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import { getGuid, myEncrypt } from 'lib/backend/encryption/useEncryptor'
import React from 'react'
import EditSecret from './EditSecret'
import SecretLayout from './SecretLayout'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { mutate } from 'swr'
import { searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { constructUserSecretSecondaryKey } from 'lib/backend/api/aws/util'
import { sortArray } from 'lib/util/collections'
import SecretsTable from './SecretsTable'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'

interface Model {
  filter: string
  createNew: boolean
  showPinEntry: boolean
}

const SecretsLayout = ({ userProfile, ticket }: { userProfile: UserProfile; ticket: AmplifyUser }) => {
  let encKey: string | null = `${ticket.id}-${userProfile.username}`

  const defaultModel: Model = {
    filter: '',
    createNew: false,
    showPinEntry: dayjs(userProfile.pin!.lastEnterDate).add(10, 'minutes').isBefore(dayjs()),
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const mutateKey = `user-secrets-${userProfile.username}`
  const dataFn = async () => {
    const dbresult = await searchRecords(constructUserSecretSecondaryKey(userProfile.username))
    const secrets = userSecretArraySchema.parse(dbresult.map((item) => JSON.parse(item.data)))
    secrets.forEach((item) => {
      if (!item.salt) {
        item.salt = getRandomSalt()
      }
    })

    const result = sortArray(secrets, ['title'], ['asc'])

    return result
  }
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn)

  const handleItemSaved = async () => {
    mutate(mutateKey)
    setModel({ ...model, createNew: false })
  }
  const handleItemDeleted = async () => {
    mutate(mutateKey)
    setModel({ ...model, filter: '', createNew: false })
  }

  const getRandomSalt = () => {
    return myEncrypt(getGuid().split('').reverse().join(''), getGuid().split('').reverse().join('')).split('').reverse().join('')
  }

  const handleFilterChanged = async (text: string) => {
    setModel({ ...model, filter: text })
  }
  const handleCancelEdit = () => {
    setModel({ ...model, createNew: false })
  }

  const handleShowAddNew = () => {
    setModel({ ...model, createNew: true })
  }

  const filteredSecrets = applyFilter(data ?? [], model.filter)

  return (
    <RequirePin minuteDuration={8} enablePolling>
      <>{isLoading && <BackdropLoader />}</>

      <>
        {model.createNew ? (
          <EditSecret username={userProfile.username} encKey={encKey} userSecret={{ title: '', secret: '', salt: getRandomSalt() }} onCancel={handleCancelEdit} onSaved={handleItemSaved} onDeleted={handleItemDeleted} />
        ) : (
          <Box pb={3}>
            <PrimaryButton text={'add'} size='small' onClick={handleShowAddNew} />
          </Box>
        )}
        {!model.createNew && (
          <SecretsTable encKey={encKey} authProfile={userProfile} filter={model.filter} filteredSecrets={filteredSecrets} handleFilterChanged={handleFilterChanged} handleItemDeleted={handleItemDeleted} handleItemSaved={handleItemSaved} />
        )}
      </>
    </RequirePin>
  )
}

const applyFilter = (list: UserSecret[], filter: string) => {
  return list.filter((o) => o.title.toLowerCase().includes(filter.toLowerCase()))
}

export default SecretsLayout
