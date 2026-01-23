'use client'

import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import UserNoteDisplay from 'components/Organizms/user/notes/UserNoteDisplay'
import RequireUserProfile from 'components/Organizms/user/RequireUserProfile'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getUserNote } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { getUtcNow } from 'lib/util/dateUtil'

const SingleNoteDisplay = ({ noteId }: { noteId: string }) => {
  const encId = decodeURIComponent(noteId)
  const id = weakDecrypt(encId)
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
  const { data, isLoading } = useSwrHelper(id, dataFn, { revalidateOnFocus: false })
  return (
    <>
      <PageHeader text={data?.title ?? ''} />
      {isLoading && <ComponentLoader />}
      <RequireUserProfile>{data && <UserNoteDisplay id={id} data={data} isEdit={false} backRoute={'/personal/notes'} />}</RequireUserProfile>
    </>
  )
}

export default SingleNoteDisplay
