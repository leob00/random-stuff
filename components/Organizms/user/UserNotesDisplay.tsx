import { notesReducer, UserNotesModel } from 'components/reducers/notesReducer'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import NoteList from './NoteList'
import { useRouter } from 'next/navigation'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { useReducer } from 'react'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const UserNotesDisplay = ({ noteTitles, username }: { noteTitles: UserNote[]; username: string }) => {
  const router = useRouter()
  const defaultModel: UserNotesModel = {
    noteTitles: noteTitles,
    isLoading: false,
    username: username,
    filteredTitles: noteTitles,
    search: '',
  }
  const [model] = useReducer(notesReducer, defaultModel)

  const handleAddNote = async () => {
    router.push(`/personal/notes/${encodeURIComponent(weakEncrypt(constructUserNotePrimaryKey(username)))}?edit=true`)
  }

  const handleNoteTitleClick = async (item: UserNote) => {
    router.push(`/personal/notes/${encodeURIComponent(weakEncrypt(item.id!))}`)
  }

  return (
    <>
      {model.isLoading && <ComponentLoader />}
      <NoteList data={noteTitles} onClicked={handleNoteTitleClick} onAddNote={handleAddNote} />
    </>
  )
}
export default UserNotesDisplay
