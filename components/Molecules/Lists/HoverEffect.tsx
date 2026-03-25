import { Stack, styled, useTheme } from '@mui/material'
import { CasinoBlueTransparent, DarkModeBlueTransparent, VeryLightBlueOpaque, VeryLightBlueTransparent, White } from 'components/themes/mainTheme'
import { isMobileDevice } from 'lib/ui/agent/agentUtil'
import { ReactNode } from 'react'

const HoverEffect = ({ children }: { children: ReactNode | React.JSX.Element[] }) => {
  const theme = useTheme()
  const StyledBox = styled(Stack)`
    // & .MuiStack-root {
    //   border-radius: 7px;
    //   padding: 0px;
    //   //color: ${theme.palette.primary.main};
    // }

    &:hover {
      border-radius: 7.8px;
      background-color: transparent;
      border: 0.02px outset ${theme.palette.info.main};
    }
    // &:hover .MuiTypography-root {
    //   color: ${theme.palette.mode === 'dark' ? theme.palette.info.main : theme.palette.primary.main};
    // }
  `
  const isMobile = isMobileDevice()

  return (
    <>
      <StyledBox>{children}</StyledBox>
    </>
  )
}

export default HoverEffect
