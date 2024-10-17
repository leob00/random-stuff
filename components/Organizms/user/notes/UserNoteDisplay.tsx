import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import EditNote from '../EditNote'
import ViewNote from '../ViewNote'
import { useState } from 'react'
import { useRouter } from 'next/router'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import { deleteRecord, getUserNoteTitles, putUserNote, putUserNoteTitles } from 'lib/backend/csr/nextApiWrapper'
import { getUtcNow } from 'lib/util/dateUtil'
import { constructUserNoteCategoryKey, constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { mutate } from 'swr'
import dayjs from 'dayjs'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const UserNoteDisplay = ({ id, data, isEdit, backRoute }: { id: string; data: UserNote; isEdit: boolean; backRoute: string }) => {
  const router = useRouter()
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [editMode, setEditMode] = useState(isEdit)

  const { userProfile } = useProfileValidator()
  const username = userProfile?.username ?? ''

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
    await deleteRecord(item.id!)
    const titles = await getUserNoteTitles(username)
    const newTitles = titles.filter((m) => m.id !== item.id)
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
    const titles = (await getUserNoteTitles(userProfile?.username ?? '')).filter((m) => m.id !== item.id)
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
      {isWaiting && <BackdropLoader />}
      {<SnackbarSuccess show={showSavedToast} text='note saved!' onClose={() => setShowSavedToast(false)} />}
      {editMode ? (
        <EditNote item={data} onSubmitted={handleSaveNote} onCanceled={() => setEditMode(false)} />
      ) : (
        <ViewNote selectedNote={data} onCancel={handleCancel} onEdit={handleEditNote} onDelete={handleDelete} />
      )}
    </>
  )
}

export default UserNoteDisplay
