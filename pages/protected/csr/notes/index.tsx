import { Container } from '@mui/material'
import UserNotesLayout from 'components/Organizms/user/UserNotesLayout'
import React from 'react'
import router from 'next/router'
import { UserNotesModel } from 'components/reducers/notesReducer'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import ButtonSkeleton from 'components/Atoms/Skeletons/ButtonSkeleton'
import TextSkeleton from 'components/Atoms/Skeletons/TextSkeleton'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'

const Notes = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true)
  const [reload, setReload] = React.useState(true)
  const [model, setModel] = React.useState<UserNotesModel | undefined>(undefined)
  const [, setIsLoading] = React.useState(true)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])
  return (
    <ResponsiveContainer>
      <PageHeader text={'Notes'} backButtonRoute={'/protected/csr/dashboard'} />
      {!isLoggedIn ? (
        <PleaseLogin />
      ) : (
        <>
          {model ? (
            <>
              <UserNotesLayout data={model} />
            </>
          ) : (
            <>
              <WarmupBox />
            </>
          )}
        </>
      )}
    </ResponsiveContainer>
  )
}

export default Notes
