import { constructUserNoteTitlesKey } from 'lib/backend/api/aws/util'
import { getUserNoteTitles } from 'lib/backend/csr/nextApiWrapper'
import React from 'react'
import useSWR from 'swr'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import UserNotesDisplay from './UserNotesDisplay'
import { useUserProfileContext } from 'lib/ui/auth/UserProfileContext'
import PageHeader from 'components/Atoms/Containers/PageHeader'

const UserNotesLayout = () => {
  const { userProfile } = useUserProfileContext()
  const username = userProfile!.username
  const enc = encodeURIComponent(weakEncrypt(constructUserNoteTitlesKey(username)))
  const mutateKey = ['/api/baseRoute', enc]
  const fetchData = async (url: string, enc: string) => {
    const result = await getUserNoteTitles(username)
    return result
  }
  const { data, isLoading } = useSWR(mutateKey, ([url, enc]) => fetchData(url, enc))

  return (
    <>
      {isLoading && <BackdropLoader />}
      <PageHeader text={'Notes'} />

      {data && <UserNotesDisplay username={username} noteTitles={data} />}
    </>
  )
}

export default UserNotesLayout
