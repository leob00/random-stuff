import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import WarmupBox from 'components/Atoms/WarmupBox'
import { notesReducer, UserNotesModel } from 'components/reducers/notesReducer'
import { constructUserNoteCategoryKey, constructUserNoteTitlesKey } from 'lib/backend/api/aws/util'
import { expireUserNote, getUserNote, getUserNoteTitles, putUserNote, putUserNoteTitles, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/models/randomStuffModels'
import { filter } from 'lodash'
import React from 'react'
import EditNote from './EditNote'
import NoteList from './NoteList'
import ViewNote from './ViewNote'
import { buildSaveModel } from 'lib/controllers/notes/notesController'
import { useUserController } from 'hooks/userController'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import useSWR, { mutate } from 'swr'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import UserNotesDisplay from './UserNotesDisplay'

const UserNotesLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const enc = encodeURIComponent(weakEncrypt(constructUserNoteTitlesKey(userProfile.username)))
  const mutateKey = ['/api/edgeGetRandomStuff', enc]
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
          <LargeGridSkeleton />
        </>
      )}
      {notes && <UserNotesDisplay username={userProfile.username} result={notes} onMutated={handleMutated} />}
    </>
  )
}

export default UserNotesLayout
