import { Container } from '@mui/material'
import BackButton from 'components/Atoms/Buttons/BackButton'
import LargeSpinner from 'components/Atoms/Loaders/LargeSpinner'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import UserNotesLayout, { UserNotesModel } from 'components/Organizms/user/UserNotesLayout'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'
import router from 'next/router'

const Notes = () => {
  // const [state, dispatch] = React.useReducer(reducer, defaultState)

  const [loggedIn, setIsLoggedIn] = React.useState(true)
  //const [isLoading, setIsLoading] = React.useState(true)
  const [reload, setReload] = React.useState(true)
  const [allNotes, setAllNotes] = React.useState<UserNote[]>([])
  const [model, setModel] = React.useState<UserNotesModel | undefined>(undefined)

  const loadData = async () => {
    const model: UserNotesModel = {
      noteTitles: [],
      isLoading: false,
      username: '',
      editMode: false,
      selectedNote: null,
      userProfile: { id: '', noteTitles: [] },
      viewMode: false,
      filteredTitles: [],
      search: '',
    }
    let user = await getUserCSR()
    if (user !== null) {
      const profile = (await getUserProfile(user.email)) as UserProfile
      if (profile) {
        model.noteTitles = profile.noteTitles
        model.filteredTitles = profile.noteTitles
        model.username = user.email
        model.isLoading = false
        model.userProfile = profile
        setModel(model)
      }
    } else {
      console.log('not logged in')
    }
    setIsLoggedIn(user !== null)
  }

  React.useEffect(() => {
    let fn = async () => {
      await loadData()
    }
    if (reload) {
      fn()
    }
  }, [reload])
  return (
    <Container>
      <BackButton
        onClicked={() => {
          router.push('/protected/csr')
        }}
      />{' '}
      {model ? <UserNotesLayout data={model} /> : <LargeSpinner />}
    </Container>
  )
}

export default Notes
