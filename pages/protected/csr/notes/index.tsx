import { Container } from '@mui/material'
import UserNotesLayout from 'components/Organizms/user/UserNotesLayout'
import React from 'react'
import router from 'next/router'
import { UserNotesModel } from 'components/reducers/notesReducer'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import ButtonSkeleton from 'components/Atoms/Skeletons/ButtonSkeleton'
import TextSkeleton from 'components/Atoms/Skeletons/TextSkeleton'

const Notes = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true)
  const [reload, setReload] = React.useState(true)
  const [model, setModel] = React.useState<UserNotesModel | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState(true)

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
    setIsLoading(false)
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
          <CenteredTitle title={'My Notes'}></CenteredTitle>
          <NonSSRWrapper>
            {model ? (
              <UserNotesLayout data={model} />
            ) : (
              <>
                <CenterStack sx={{ pt: 6 }}>
                  <TextSkeleton />
                </CenterStack>
                <WarmupBox />
              </>
            )}
          </NonSSRWrapper>
        </>
      )}
    </Container>
  )
}

export default Notes
