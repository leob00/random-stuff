import { Stack, styled, useTheme } from '@mui/material'
import { CasinoBlackTransparent, CasinoBlueTransparent, DarkModeBlueTransparent } from 'components/themes/mainTheme'
import { ReactNode } from 'react'

const HoverEffect = ({ children }: { children: ReactNode | React.JSX.Element[] }) => {
  const theme = useTheme()
  const StyledBox = styled(Stack)`
    & .MuiStack-root {
      //background-color: transparent;
      border-radius: 8px;
      padding: 1px;
    }

    &:hover {
      border-radius: 6px;
      background-color: ${DarkModeBlueTransparent};
    }
    &:hover .MuiTypography-root {
      color: ${theme.palette.info.contrastText};
    }
  `
  return <StyledBox>{children}</StyledBox>
}

export default HoverEffect
