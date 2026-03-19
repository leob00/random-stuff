import { Stack, styled, useTheme } from '@mui/material'
import { CasinoBlueTransparent, DarkModeBlueTransparent, VeryLightBlueOpaque, VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { isMobileDevice } from 'lib/ui/agent/agentUtil'
import { ReactNode } from 'react'

const HoverEffect = ({ children }: { children: ReactNode | React.JSX.Element[] }) => {
  const theme = useTheme()
  const StyledBox = styled(Stack)`
    & .MuiStack-root {
      border-radius: 7px;
      padding: 0px;
    }

    &:hover {
      border-radius: 7.8px;
      background-color: transparent;
      border: 0.02px outset ${CasinoBlueTransparent};
    }
    &:hover .MuiTypography-root {
      color: ${theme.palette.primary.contrastText};
    }
  `
  const isMobile = isMobileDevice()

  return (
    <>
      <StyledBox>{children}</StyledBox>
    </>
  )
}

export default HoverEffect
