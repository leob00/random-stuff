import { useUserProfileContext } from 'lib/ui/auth/UserProfileContext'
import React, { ReactNode } from 'react'

const RequireUserProfileWrapper = ({ children }: { children: ReactNode | React.JSX.Element[] }) => {
  const { userProfile } = useUserProfileContext()
  if (!userProfile) {
    return <></>
  }
  return <>{children}</>
}

export default RequireUserProfileWrapper
