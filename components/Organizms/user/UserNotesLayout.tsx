import { constructUserNoteTitlesKey } from 'lib/backend/api/aws/util'
import { getUserNoteTitles } from 'lib/backend/csr/nextApiWrapper'
import useSWR from 'swr'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import UserNotesDisplay from './UserNotesDisplay'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { getUtcNow } from 'lib/util/dateUtil'
import dayjs from 'dayjs'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const UserNotesLayout = () => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  const username = userProfile!.username
  const enc = encodeURIComponent(weakEncrypt(constructUserNoteTitlesKey(username)))
  const mutateKey = ['/api/baseRoute', enc]

  const fetchData = async (url: string, enc: string) => {
    const result = await getUserNoteTitles(username)
    const utcNow = getUtcNow()
    const filtered = result.filter((m) => !m.expirationDate || (m.expirationDate && dayjs(m.expirationDate).isAfter(utcNow)))
    return filtered
  }
  const { data, isLoading } = useSWR(mutateKey, ([url, enc]) => fetchData(url, enc))

  return (
    <>
      {isLoading && <BackdropLoader />}
      <PageHeader text={'Notes'} />

      {data && !isValidatingProfile && <UserNotesDisplay username={username} noteTitles={data} />}
    </>
  )
}

export default UserNotesLayout
