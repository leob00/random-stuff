import UserNotesLayout from 'components/Organizms/user/UserNotesLayout'
import React from 'react'
import router from 'next/router'
import { UserNotesModel } from 'components/reducers/notesReducer'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { getUserNoteTitles, putUserNoteTitles, putUserProfile } from 'lib/backend/csr/nextApiWrapper'

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
      userProfile: { id: '', username: '' },
      viewMode: false,
      filteredTitles: [],
      search: '',
    }
    const profile = await userController.fetchProfilePassive(300)
    if (profile === null) {
      router.push('/login')
      console.log('not logged in')
    } else {
      let noteTitles = await getUserNoteTitles(profile.username)
      if (noteTitles.length === 0 && profile.noteTitles) {
        console.log('migration of notes is required')
        noteTitles = profile.noteTitles
        putUserNoteTitles(profile.username, noteTitles)
      } else if (profile.noteTitles) {
        profile.noteTitles = undefined
        putUserProfile(profile)
      }
      model.noteTitles = noteTitles
      model.filteredTitles = noteTitles
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
