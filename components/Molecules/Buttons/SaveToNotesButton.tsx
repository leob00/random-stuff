import { Check } from '@mui/icons-material'
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

const SaveToNotesButton = ({ username, note, onSaved }: { username: string; note: UserNote; onSaved: (note: UserNote) => void }) => {
  const [saving, setSaving] = React.useState(false)
  const [saved, setIsSaved] = React.useState(false)
  const userController = useUserController()
  const handleClick = async (item: UserNote) => {
    setSaving(true)
    const profile = (await getUserProfile(username)) as UserProfile | null
    if (profile) {
      profile.noteTitles.push(item)
      profile.noteTitles = orderBy(profile.noteTitles, ['dateModified'], ['desc'])
      await putUserProfile(profile)
      await putUserNote(item, constructUserNoteCategoryKey(username))
      await userController.setProfile(profile)
      setIsSaved(true)
      onSaved(item)
    }
  }

  return !saved ? (
    <SecondaryButton text={saving ? 'saving...' : 'read later'} size='small' onClick={() => handleClick(note)} disabled={saving} />
  ) : (
    <Stack fontSize={'small'} justifyContent={'center'} flexDirection={'row'}>
      <SavedNoteButtonLink />
      {/* <Button
        variant='contained'
        color='success'
        size='small'
        onClick={() => {
          router.push('/protected/csr/notes')
        }}
      >
        read now
      </Button> */}
    </Stack>
  )
}

export default SaveToNotesButton
