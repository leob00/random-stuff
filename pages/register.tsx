import LoginLayout from 'components/Organizms/Login/LoginLayout'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { Authenticator } from '@aws-amplify/ui-react'

const Page = () => {
  return (
    <>
      <ResponsiveContainer>
        <Authenticator.Provider>
          <LoginLayout defaultTab='Create Account' />
        </Authenticator.Provider>
      </ResponsiveContainer>
    </>
  )
}

export default Page
