import { Stack, styled, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'

const HoverEffect = ({ children }: { children: ReactNode | JSX.Element[] }) => {
  const theme = useTheme()
  const StyledBox = styled(Stack)`
    & .MuiStack-root {
      background-color: transparent;
    }
    & .MuiCardHeader-root {
      //background-color: red;
      //border-radius: 28px;
    }
    &:hover {
      border: solid 0.05px ${theme.palette.primary.main};
      border-radius: 6px;
      padding: 1px;
    }
  `
  return <StyledBox>{children}</StyledBox>
}

export default HoverEffect
