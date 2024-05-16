import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { notesReducer, UserNotesModel } from 'components/reducers/notesReducer'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import React from 'react'
import NoteList from './NoteList'
import { useRouter } from 'next/router'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'

const UserNotesDisplay = ({ noteTitles, username }: { noteTitles: UserNote[]; username: string }) => {
  const router = useRouter()
  const defaultModel: UserNotesModel = {
    noteTitles: noteTitles,
    isLoading: false,
    username: username,
    filteredTitles: noteTitles,
    search: '',
  }
  const [model] = React.useReducer(notesReducer, defaultModel)

  const handleAddNote = async () => {
    router.push(`/protected/csr/notes/${encodeURIComponent(weakEncrypt(constructUserNotePrimaryKey(username)))}?edit=true`)
  }

  const handleNoteTitleClick = async (item: UserNote) => {
    router.push(`/protected/csr/notes/${encodeURIComponent(weakEncrypt(item.id!))}`)
  }

  return (
    <>
      {model.isLoading && <BackdropLoader />}
      <NoteList data={noteTitles} onClicked={handleNoteTitleClick} onAddNote={handleAddNote} />
    </>
  )
}
export default UserNotesDisplay
