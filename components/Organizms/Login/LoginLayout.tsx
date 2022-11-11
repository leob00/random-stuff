import { Authenticator, ThemeProvider, useTheme } from '@aws-amplify/ui-react'
import { Container } from '@mui/material'
import React, { ReactChild, ReactNode } from 'react'

import styled from '@emotion/styled'
import { ClassNames } from '@emotion/react'

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
