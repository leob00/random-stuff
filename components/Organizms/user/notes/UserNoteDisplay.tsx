import { S3Object, UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import EditNote from '../EditNote'
import ViewNote from '../ViewNote'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { deleteRecord, getUserNoteTitles, putUserNote, putUserNoteTitles } from 'lib/backend/csr/nextApiWrapper'
import { getUtcNow } from 'lib/util/dateUtil'
import { constructUserNoteCategoryKey, constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { mutate } from 'swr'
import dayjs from 'dayjs'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { sortArray } from 'lib/util/collections'
import { sleep } from 'lib/util/timers'
import ProgressDrawer from 'components/Atoms/Drawers/ProgressDrawer'

const UserNoteDisplay = ({ id, data, isEdit, backRoute }: { id: string; data: UserNote; isEdit: boolean; backRoute: string }) => {
  const router = useRouter()
  const [toastText, setToastText] = useState<string | null>(null)
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
    setToastText(`deleting note: ${item.title}`)
    setShowSaveDrawer(true)
    if (item.files) {
      for (let f of item.files) {
        await postBody('/api/aws/s3/item', 'DELETE', f)
        setToastText(`deleted file: ${f.filename}`)
        await sleep(750)
      }
    }

    await deleteRecord(item.id!)

    const titles = await getUserNoteTitles(username)
    const newTitles = titles.filter((m) => m.id !== item.id)
    await putUserNoteTitles(username, newTitles)
    setToastText(`note deleted!`)
    await sleep(250)
    setShowSaveDrawer(false)
    router.push(backRoute)
  }
  const handleSaveNote = async (item: UserNote) => {
    setShowSaveDrawer(true)
    setToastText(`saving note: ${item.title}`)
    const now = getUtcNow().format()
    item.dateModified = now
    if (!item.id) {
      item.id = constructUserNotePrimaryKey(username)
      item.dateCreated = now
    }
    const category = constructUserNoteCategoryKey(username)
    putUserNote(item, category, item.expirationDate ? Math.floor(dayjs(item.expirationDate).valueOf() / 1000) : undefined)
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
    putUserNoteTitles(username, newTitles)
    setToastText(`note saved!`)
    await sleep(250)
    setShowSaveDrawer(false)
    mutate(id, item, { revalidate: false })
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
      {!isValidatingProfile && userProfile && (
        <>
          {/* {toastText && <SnackbarSuccess show={!!toastText} text={toastText} onClose={() => setToastText(null)} />} */}
          {editMode ? (
            <EditNote item={data} onSubmitted={handleSaveNote} onCanceled={handleCancelEdit} />
          ) : (
            <>
              <ViewNote
                selectedNote={data}
                onCancel={handleCancel}
                onEdit={handleEditNote}
                onDelete={handleDelete}
                userProfile={userProfile}
                onFilesChanged={handleFilesChanged}
              />
            </>
          )}
        </>
      )}
      {showSaveDrawer && <ProgressDrawer isOpen={showSaveDrawer} message={toastText} />}
    </>
  )
}

export default UserNoteDisplay
function postBody(arg0: string, arg1: string, f: S3Object) {
  throw new Error('Function not implemented.')
}
