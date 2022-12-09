import { Authenticator } from '@aws-amplify/ui-react'
import { Container } from '@mui/material'
import React from 'react'

import styled from '@emotion/styled'

const LoginLayout = () => {
  const StyledDiv = styled.div`
    background-color: transparent;
    & > amplify-flex amplify-tabs {
      color: hotpink;
    }
  `
  return (
    <Container>
      <StyledDiv>
        <Authenticator />
      </StyledDiv>
    </Container>
  )
}
export default LoginLayout
