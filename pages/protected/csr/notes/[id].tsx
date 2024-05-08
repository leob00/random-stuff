import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import EditNote from 'components/Organizms/user/EditNote'
import RequireUserProfile from 'components/Organizms/user/RequireUserProfile'
import ViewNote from 'components/Organizms/user/ViewNote'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { useUserController } from 'hooks/userController'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserNoteCategoryKey, constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { deleteRecord, deleteUserNote, getUserNote, getUserNoteTitles, putUserNote, putUserNoteTitles } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { getUtcNow } from 'lib/util/dateUtil'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { mutate } from 'swr'

const Page = () => {
  const router = useRouter()
  const encId = decodeURIComponent(router.query.id as string)
  const isEdit = router.query['edit']
  const id = weakDecrypt(encId)
  const backRoute = '/protected/csr/notes'
  const { authProfile } = useUserController()
  const username = authProfile!.username

  const dataFn = async () => {
    const note = await getUserNote(id)
    if (note === null) {
      const now = getUtcNow().format()
      const newNote: UserNote = {
        title: '',
        id: id,
        body: '',
        dateCreated: now,
        dateModified: now,
      }
      return newNote
    }
    return note
  }
  const [editMode, setEditMode] = useState(!!isEdit)
  const { data, isLoading } = useSwrHelper(id, dataFn, { revalidateOnFocus: false })
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  const handleCancel = () => {
    router.push(backRoute)
  }
  const handleEditNote = () => {
    setEditMode(true)
  }
  const handleDelete = async (item: UserNote) => {
    if (!item.id) {
      router.push(backRoute)
      return
    }
    setIsWaiting(true)
    deleteRecord(item.id!)
    const titles = await getUserNoteTitles(authProfile!.username)
    const newTitles = titles.filter((m) => m.id !== item.id)
    console.log('newTitles: ', newTitles)
    await putUserNoteTitles(username, newTitles)
    router.push(backRoute)
  }
  const handleSaveNote = async (item: UserNote) => {
    const now = getUtcNow().format()
    item.dateModified = now
    if (!item.id) {
      item.id = constructUserNotePrimaryKey(username)
      item.dateCreated = now
    }

    putUserNote(item, constructUserNoteCategoryKey(username), item.expirationDate ? Math.floor(dayjs(item.expirationDate).valueOf() / 1000) : undefined)
    const titles = (await getUserNoteTitles(authProfile!.username)).filter((m) => m.id !== item.id)
    titles.unshift({
      id: item.id,
      title: item.title,
      body: '',
      dateCreated: now,
      dateModified: now,
      expirationDate: item.expirationDate,
    })
    putUserNoteTitles(username, titles)
    mutate(id, item, { revalidate: false })
    setShowSavedToast(true)
  }

  return (
    <>
      {<SnackbarSuccess show={showSavedToast} text='note saved!' onClose={() => setShowSavedToast(false)} />}
      {isLoading && <BackdropLoader />}
      {isWaiting && <BackdropLoader />}
      <ResponsiveContainer>
        <RequireUserProfile>
          <PageHeader text='' backButtonRoute={backRoute} />
          {data && <>{editMode ? <EditNote item={data} onSubmitted={handleSaveNote} onCanceled={() => setEditMode(false)} /> : <ViewNote selectedNote={data} onCancel={handleCancel} onEdit={handleEditNote} onDelete={handleDelete} />}</>}
        </RequireUserProfile>
      </ResponsiveContainer>
    </>
  )
}

export default Page
