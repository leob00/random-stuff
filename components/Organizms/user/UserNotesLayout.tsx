import { constructUserNoteTitlesKey } from 'lib/backend/api/aws/util'
import { getUserNoteTitles } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import useSWR, { mutate } from 'swr'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import UserNotesDisplay from './UserNotesDisplay'

const UserNotesLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const enc = encodeURIComponent(weakEncrypt(constructUserNoteTitlesKey(userProfile.username)))
  const mutateKey = ['/api/baseRoute', enc]
  const fetchData = async (url: string, enc: string) => {
    const result = await getUserNoteTitles(userProfile.username)
    return result
  }

  const { data: notes, isLoading, isValidating } = useSWR(mutateKey, ([url, enc]) => fetchData(url, enc))

  const handleMutated = (newData: UserNote[]) => {
    mutate(mutateKey, newData, { revalidate: false })
  }

  return (
    <>
      {isLoading && (
        <>
          <BackdropLoader />
        </>
      )}
      {notes && <UserNotesDisplay username={userProfile.username} result={notes} onMutated={handleMutated} />}
    </>
  )
}

export default UserNotesLayout
