import { Stack } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { constructUserNoteCategoryKey, constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { getUserNoteTitles, putUserNote, putUserNoteTitles } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/models/randomStuffModels'
import { orderBy } from 'lodash'
import React from 'react'
import SavedNoteButtonLink from './SavedNoteButtonLink'
import { getUtcNow } from 'lib/util/dateUtil'
import RollingLinearProgress from 'components/Atoms/Loaders/RollingLinearProgress'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'

const SaveToNotesButton = ({ username, note, onSaved }: { username: string; note: UserNote; onSaved: (note: UserNote) => void }) => {
  const [saving, setSaving] = React.useState(false)
  const [saved, setIsSaved] = React.useState(false)
  const handleClick = async (item: UserNote) => {
    setSaving(true)
    let noteTitles = await getUserNoteTitles(username)
    item.id = constructUserNotePrimaryKey(username)
    noteTitles.push({ ...item, body: '' })
    noteTitles = orderBy(noteTitles, ['dateModified'], ['desc'])
    await putUserNoteTitles(username, noteTitles)
    const now = getUtcNow()
    const expireDt = now.add(3, 'day')
    const expireSeconds = Math.floor(expireDt.valueOf() / 1000)
    item.expirationDate = expireDt.format()
    await putUserNote(item, constructUserNoteCategoryKey(username), expireSeconds)
    setIsSaved(true)
    onSaved(item)
  }

  return (
    <>
      {!saved ? (
        <Stack justifyContent={'center'} direction='row' spacing={2}>
          {saving ? (
            <RollingLinearProgress height={30} width={100} />
          ) : (
            <PrimaryButton text={saving ? 'saving...' : 'read later'} size='small' onClick={() => handleClick(note)} disabled={saving} />
          )}
        </Stack>
      ) : (
        <Stack fontSize={'small'} justifyContent={'center'} flexDirection={'row'}>
          <SavedNoteButtonLink />
        </Stack>
      )}
    </>
  )
}

export default SaveToNotesButton
