import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import React, { ReactNode } from 'react'

const RequireUserProfile = ({ children }: { children: ReactNode | JSX.Element[] }) => {
  const { authProfile, setProfile, fetchProfilePassive } = useUserController()
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let fn = async () => {
      if (!authProfile) {
        const p = await fetchProfilePassive()
        setProfile(p)
      }
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile])

  return (
    <>
      {isLoading && <BackdropLoader />}
      <>{!isLoading && !authProfile ? <PleaseLogin /> : children}</>
    </>
  )
}

export default RequireUserProfile
