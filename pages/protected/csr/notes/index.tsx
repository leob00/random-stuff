import UserNotesLayout from 'components/Organizms/user/UserNotesLayout'
import React from 'react'
import router from 'next/router'
import { UserNotesModel } from 'components/reducers/notesReducer'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const Notes = () => {
  const userController = useUserController()
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let fn = async () => {
      const p = await userController.fetchProfilePassive(900)
      setUserProfile(p)
      setIsLoading(false)
    }
    fn()
  }, [userProfile])
  return (
    <ResponsiveContainer>
      <PageHeader text={'Notes'} backButtonRoute={'/protected/csr/dashboard'} />
      {isLoading ? (
        <WarmupBox />
      ) : (
        <>
          {!userProfile ? (
            <PleaseLogin />
          ) : (
            <>
              <UserNotesLayout userProfile={userProfile} />
            </>
          )}
        </>
      )}
    </ResponsiveContainer>
  )
}

export default Notes
