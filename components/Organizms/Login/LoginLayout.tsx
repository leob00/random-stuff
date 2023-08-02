import { Authenticator } from '@aws-amplify/ui-react'
import React from 'react'
import styled from '@emotion/styled'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { useUserController } from 'hooks/userController'
import PleaseLogin from 'components/Molecules/PleaseLogin'

const LoginLayout = () => {
  const StyledDiv = styled.div`
    background-color: transparent;
    & > amplify-flex amplify-tabs {
      color: hotpink;
    }
  `

  return (
    <ResponsiveContainer>
      <StyledDiv>
        <Authenticator variation='modal' initialState={'signIn'} />
      </StyledDiv>
    </ResponsiveContainer>
  )
}
export default LoginLayout
