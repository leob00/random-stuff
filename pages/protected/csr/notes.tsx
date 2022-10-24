import { Box, Container, Skeleton } from '@mui/material'
import BackButton from 'components/Atoms/Buttons/BackButton'
import LargeSpinner from 'components/Atoms/Loaders/LargeSpinner'
import UserNotesLayout from 'components/Organizms/user/UserNotesLayout'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'
import router from 'next/router'
import { UserNotesModel } from 'components/reducers/notesReducer'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import { CasinoBlueTransparent, DarkBlueTransparent, VeryLightBlueTransparent } from 'components/themes/mainTheme'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import TopPageSkeleton from 'components/Atoms/Skeletons/TopPageSkeleton'

const Notes = () => {
  // const [state, dispatch] = React.useReducer(reducer, defaultState)

  const [isLoggedIn, setIsLoggedIn] = React.useState(true)
  //const [isLoading, setIsLoading] = React.useState(true)
  const [reload, setReload] = React.useState(true)
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
      router.push('/login')
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
      {/* <TopPageSkeleton /> */}
      {!isLoggedIn ? (
        <PleaseLogin />
      ) : (
        <>
          <CenterStack>
            <CenteredTitle title={'My Notes'}></CenteredTitle>
          </CenterStack>
          {model ? <UserNotesLayout data={model} /> : <WarmupBox text='loading notes...' />}{' '}
        </>
      )}
    </Container>
  )
}

export default Notes
