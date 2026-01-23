import { Stack, Typography } from '@mui/material'
import { constructUserNoteCategoryKey, constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { getUserNoteTitles, putUserNote, putUserNoteTitles } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { orderBy } from 'lodash'
import SavedNoteButtonLink from './SavedNoteButtonLink'
import { getUtcNow } from 'lib/util/dateUtil'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import { useState } from 'react'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'

const SaveToNotesButton = ({ username, note, onSaved }: { username: string; note: UserNote; onSaved?: (note: UserNote) => void }) => {
  const [saving, setSaving] = useState(false)
  const [saved, setIsSaved] = useState(false)
  const [noteUrl, setNoteUrl] = useState<string | null>(null)

  const handleClick = async () => {
    setSaving(true)
    const item = { ...note, id: constructUserNotePrimaryKey(username) }
    let noteTitles = await getUserNoteTitles(username)
    noteTitles.push({ ...item, body: '' })
    noteTitles = orderBy(noteTitles, ['dateModified'], ['desc'])
    await putUserNoteTitles(username, noteTitles)
    const now = getUtcNow()
    const expireDt = now.add(3, 'day').add(1, 'minute')
    const expireSeconds = Math.floor(expireDt.valueOf() / 1000)
    item.expirationDate = expireDt.format()
    await putUserNote(item, constructUserNoteCategoryKey(username), expireSeconds)
    setIsSaved(true)
    setNoteUrl(`/personal/notes/${encodeURIComponent(weakEncrypt(item.id!))}`)
    onSaved?.(item)
  }

  return (
    <>
      {!saved ? (
        <Stack justifyContent={'center'} direction='row' spacing={2}>
          <LinkButton onClick={handleClick} disabled={saving} underline={!saving}>
            <Typography>{saving ? 'saving...' : 'read later'}</Typography>
          </LinkButton>
        </Stack>
      ) : (
        <Stack fontSize={'small'} justifyContent={'center'} flexDirection={'row'}>
          <SavedNoteButtonLink noteRoute={noteUrl} />
        </Stack>
      )}
    </>
  )
}

export default SaveToNotesButton
