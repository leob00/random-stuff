'use client'
import { constructUserNoteTitlesKey } from 'lib/backend/api/aws/util'
import { getUserNoteTitles } from 'lib/backend/csr/nextApiWrapper'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import UserNotesDisplay from './UserNotesDisplay'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { getUtcNow } from 'lib/util/dateUtil'
import dayjs from 'dayjs'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { useSwrHelper } from 'hooks/useSwrHelper'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

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
      {isLoading && <ComponentLoader />}
      {!isValidatingProfile && <UserNotesDisplay username={username} noteTitles={data ?? []} />}
    </>
  )
}

export default UserNotesLayout
