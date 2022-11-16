import { Check, QuestionAnswer, QuestionMarkOutlined } from '@mui/icons-material'
import { Box, Button, Stack } from '@mui/material'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructUserNoteCategoryKey } from 'lib/backend/api/aws/util'
import { getUserProfile, putUserNote, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/models/randomStuffModels'
import { orderBy } from 'lodash'
import React from 'react'
import router from 'next/router'
import SavedNoteButtonLink from './SavedNoteButtonLink'
import { getUtcNow } from 'lib/util/dateUtil'
import ExprationWarningTooltip from 'components/Atoms/Tooltips/ExprationWarningTooltip'
import RollingLinearProgress from 'components/Atoms/Loaders/RollingLinearProgress'

const SaveToNotesButton = ({ username, note, onSaved }: { username: string; note: UserNote; onSaved: (note: UserNote) => void }) => {
  const [saving, setSaving] = React.useState(false)
  const [saved, setIsSaved] = React.useState(false)
  const userController = useUserController()
  const handleClick = async (item: UserNote) => {
    setSaving(true)
    const profile = (await getUserProfile(username)) as UserProfile | null
    if (profile) {
      profile.noteTitles.push({ ...item, body: '' })
      profile.noteTitles = orderBy(profile.noteTitles, ['dateModified'], ['desc'])
      await putUserProfile(profile)
      const now = getUtcNow()
      const expireDt = now.add(3, 'day')
      const expireSeconds = Math.floor(expireDt.valueOf() / 1000)
      item.expirationDate = expireDt.format()
      await putUserNote(item, constructUserNoteCategoryKey(username), expireSeconds)
      await userController.setProfile(profile)
      setIsSaved(true)
      onSaved(item)
    }
  }

  return !saved ? (
    <Stack justifyContent={'center'} direction='row' spacing={2}>
      {saving ? <RollingLinearProgress height={30} width={100} /> : <SecondaryButton text={saving ? 'saving...' : 'read later'} size='small' onClick={() => handleClick(note)} disabled={saving} />}
    </Stack>
  ) : (
    <Stack fontSize={'small'} justifyContent={'center'} flexDirection={'row'}>
      <SavedNoteButtonLink />
    </Stack>
  )
}

export default SaveToNotesButton
