import { S3Object, UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
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
import { sortArray } from 'lib/util/collections'
import { postDelete } from 'lib/backend/api/fetchFunctions'
import { sleep } from 'lib/util/timers'
import ProgressDrawer from 'components/Atoms/Drawers/ProgressDrawer'

const UserNoteDisplay = ({ id, data, isEdit, backRoute }: { id: string; data: UserNote; isEdit: boolean; backRoute: string }) => {
  const router = useRouter()
  const [toastText, setToastText] = useState<string | null>(null)
  const [isWaiting, setIsWaiting] = useState(false)
  const [editMode, setEditMode] = useState(isEdit)
  const [showSaveDrawer, setShowSaveDrawer] = useState(false)

  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
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
    setShowSaveDrawer(true)
    if (item.files) {
      for (let f of item.files) {
        await postDelete('/api/s3', f)
        setToastText(`deleted file: ${f.filename}`)
        await sleep(1000)
      }
    }

    await deleteRecord(item.id!)
    setToastText(`deleted note: ${item.title}`)
    const titles = await getUserNoteTitles(username)
    const newTitles = titles.filter((m) => m.id !== item.id)
    await putUserNoteTitles(username, newTitles)
    setShowSaveDrawer(false)
    router.push(backRoute)
  }
  const handleSaveNote = async (item: UserNote) => {
    //setIsWaiting(true)
    setShowSaveDrawer(true)
    setToastText(`saving note: ${item.title}`)
    const now = getUtcNow().format()
    item.dateModified = now
    if (!item.id) {
      item.id = constructUserNotePrimaryKey(username)
      item.dateCreated = now
    }
    const category = constructUserNoteCategoryKey(username)
    await putUserNote(item, category, item.expirationDate ? Math.floor(dayjs(item.expirationDate).valueOf() / 1000) : undefined)
    const titles = await getUserNoteTitles(username)
    const newTitles = titles.filter((m) => m.id !== item.id)
    newTitles.unshift({
      id: item.id,
      title: item.title,
      body: '',
      dateCreated: now,
      dateModified: now,
      expirationDate: item.expirationDate,
      files: item.files,
    })
    await putUserNoteTitles(username, newTitles)
    setIsWaiting(false)
    setToastText(`note saved!`)
    setTimeout(() => {
      setShowSaveDrawer(false)
      mutate(id, item, { revalidate: false })
    }, 1000)
  }
  const handleCancelEdit = () => {
    if (data.title.length === 0) {
      router.push(backRoute)
    } else {
      setEditMode(false)
    }
  }
  const handleFilesChanged = async (files: S3Object[]) => {
    const newFiles = sortArray(files, ['filename'], ['asc'])
    const newNote = { ...data, files: newFiles }
    await handleSaveNote(newNote)
  }

  return (
    <>
      {isWaiting && <BackdropLoader />}
      {!isValidatingProfile && userProfile && (
        <>
          {/* {toastText && <SnackbarSuccess show={!!toastText} text={toastText} onClose={() => setToastText(null)} />} */}
          {editMode ? (
            <EditNote item={data} onSubmitted={handleSaveNote} onCanceled={handleCancelEdit} />
          ) : (
            <ViewNote
              selectedNote={data}
              onCancel={handleCancel}
              onEdit={handleEditNote}
              onDelete={handleDelete}
              userProfile={userProfile}
              onFilesChanged={handleFilesChanged}
            />
          )}
        </>
      )}
      {showSaveDrawer && <ProgressDrawer isOpen={showSaveDrawer} message={toastText} />}
    </>
  )
}

export default UserNoteDisplay
