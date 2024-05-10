import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import RequireUserProfile from 'components/Organizms/user/RequireUserProfile'
import UserNoteDisplay from 'components/Organizms/user/notes/UserNoteDisplay'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getUserNote } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { getUtcNow } from 'lib/util/dateUtil'
import { useRouter } from 'next/router'
import React from 'react'

const Page = () => {
  const router = useRouter()
  const encId = decodeURIComponent(router.query.id as string)
  const isEdit = router.query['edit']
  const id = weakDecrypt(encId)
  const backRoute = '/protected/csr/notes'

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

  //console.log('authProfileContext: ', authProfileContext)

  return (
    <>
      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <PageHeader text='' backButtonRoute={backRoute} />
        <RequireUserProfile>{data && <UserNoteDisplay id={id} data={data} isEdit={!!isEdit} backRoute={backRoute} />}</RequireUserProfile>
      </ResponsiveContainer>
    </>
  )
}

export default Page
