import React from 'react'
import '@aws-amplify/ui-react/styles.css'
import LoginLayout from 'components/Organizms/Login/LoginLayout'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'

const Page = () => {
  return (
    <>
      <ResponsiveContainer>
        <LoginLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page
