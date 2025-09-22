import { Stack, styled, useTheme } from '@mui/material'
import { ReactNode } from 'react'

const HoverEffect = ({ children }: { children: ReactNode | React.JSX.Element[] }) => {
  const theme = useTheme()
  const StyledBox = styled(Stack)`
    & .MuiStack-root {
      background-color: transparent;
      border-radius: 8px;
      padding: 1px;
    }
    &.MuiTypography-root {
      color: ${theme.palette.info.main};
    }
    &:hover {
      //border: solid 0.05px ${theme.palette.primary.contrastText};
      border-radius: 6px;
      //padding: 1px;
      background-color: ${theme.palette.info.main};
      color: ${theme.palette.primary.main};
    }
  `
  return <StyledBox>{children}</StyledBox>
}

export default HoverEffect
