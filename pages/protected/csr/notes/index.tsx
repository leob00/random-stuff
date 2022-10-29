import { Box, Container, Skeleton } from '@mui/material'
import BackButton from 'components/Atoms/Buttons/BackButton'
import LargeSpinner from 'components/Atoms/Loaders/LargeSpinner'
import UserNotesLayout from 'components/Organizms/user/UserNotesLayout'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserProfile } from 'lib/backend/csr/nextApiWrapper'
import React from 'react'
import router from 'next/router'
import { UserNotesModel } from 'components/reducers/notesReducer'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useAuthStore } from 'lib/backend/auth/useAuthStore'
import shallow from 'zustand/shallow'
import { useUserController } from 'hooks/userController'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'

const Notes = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true)
  const [reload, setReload] = React.useState(true)
  const [model, setModel] = React.useState<UserNotesModel | undefined>(undefined)

  const userController = useUserController()

  const loadData = async () => {
    const model: UserNotesModel = {
      noteTitles: [],
      isLoading: false,
      username: '',
      editMode: false,
      selectedNote: null,
      userProfile: { id: '', noteTitles: [], username: '' },
      viewMode: false,
      filteredTitles: [],
      search: '',
    }
    const profile = await userController.refetchProfile(300)
    if (profile === null) {
      router.push('/login')
      console.log('not logged in')
    } else {
      model.noteTitles = profile.noteTitles
      model.filteredTitles = profile.noteTitles
      model.username = profile.username
      model.isLoading = false
      model.userProfile = profile
      setModel(model)
    }
    setIsLoggedIn(profile !== null)
  }

  React.useEffect(() => {
    let fn = async () => {
      setReload(false)
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
          <NonSSRWrapper>{model ? <UserNotesLayout data={model} /> : <WarmupBox />}</NonSSRWrapper>
        </>
      )}
    </Container>
  )
}

export default Notes
