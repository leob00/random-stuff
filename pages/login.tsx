import React from 'react'
import LoginLayout from 'components/Organizms/Login/LoginLayout'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { Authenticator } from '@aws-amplify/ui-react'

const Page = () => {
  return (
    <>
      <ResponsiveContainer>
        <Authenticator.Provider>
          <LoginLayout />
        </Authenticator.Provider>
      </ResponsiveContainer>
    </>
  )
}

export default Page
