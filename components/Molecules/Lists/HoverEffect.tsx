import { Stack, styled, useTheme } from '@mui/material'
import { CasinoBlueTransparent, DarkModeBlueTransparent } from 'components/themes/mainTheme'
import { isMobileDevice } from 'lib/ui/agent/agentUtil'
import { ReactNode } from 'react'

const HoverEffect = ({ children }: { children: ReactNode | React.JSX.Element[] }) => {
  const theme = useTheme()
  const StyledBox = styled(Stack)`
    & .MuiStack-root {
      //background-color: transparent;
      border-radius: 7px;
      padding: 1px;
      //border: 0px inset ${CasinoBlueTransparent};
    }

    &:hover {
      border-radius: 7px;
      //color: ${theme.palette.info.main};
      background-color: transparent;
      border: 1px outset ${CasinoBlueTransparent};
    }
    &:hover .MuiTypography-root {
      //color: ${theme.palette.info.contrastText};
    }
  `
  const isMobile = isMobileDevice()

  return <>{!isMobile ? <StyledBox>{children}</StyledBox> : <>{children}</>}</>
}

export default HoverEffect
