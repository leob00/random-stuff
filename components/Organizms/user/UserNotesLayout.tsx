import { constructUserNoteTitlesKey } from 'lib/backend/api/aws/util'
import { getUserNoteTitles } from 'lib/backend/csr/nextApiWrapper'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import UserNotesDisplay from './UserNotesDisplay'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { getUtcNow } from 'lib/util/dateUtil'
import dayjs from 'dayjs'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { useSwrHelper } from 'hooks/useSwrHelper'

const UserNotesLayout = () => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  const username = userProfile!.username
  const enc = encodeURIComponent(weakEncrypt(constructUserNoteTitlesKey(username)))
  const mutateKey = `user-note-${enc}`

  const dataFn = async () => {
    const result = await getUserNoteTitles(username)
    const utcNow = getUtcNow()
    const filtered = result.filter((m) => !m.expirationDate || (m.expirationDate && dayjs(m.expirationDate).isAfter(utcNow)))
    return filtered
  }
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn)

  return (
    <>
      {isLoading && <BackdropLoader />}
      <PageHeader text={'Notes'} />

      {!isValidatingProfile && <UserNotesDisplay username={username} noteTitles={data ?? []} />}
    </>
  )
}

export default UserNotesLayout
