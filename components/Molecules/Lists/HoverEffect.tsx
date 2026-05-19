'use client'
import { Paper, Stack, styled, useTheme } from '@mui/material'
import { CasinoBlueTransparent, DarkModeBlueTransparent, VeryLightBlueOpaque, VeryLightBlueTransparent, White } from 'components/themes/mainTheme'
import { isMobileDevice } from 'lib/ui/agent/agentUtil'
import { ReactNode } from 'react'

const HoverEffect = ({ children }: { children: ReactNode | React.JSX.Element[] }) => {
  const theme = useTheme()
  const StyledBox = styled(Stack)`
    & .MuiStack-root {
      border-radius: 7.8px;
      border: 0.02px outset transparent;
      padding-top: 2px;
      padding-bottom: 2px;
      padding-left: 1px;
      padding-right: 1px;
    }

    &:hover {
      border-radius: 7.8px;
      //background-color: transparent;
      border: 0.02px outset ${theme.palette.info.main};
    }
  `

  return (
    <>
      {/* <Paper sx={{ borderRadius: '7.8px', bgcolor: 'transparent', backgroundColor: 'transparent' }} elevation={1}> */}
      <StyledBox>{children}</StyledBox>
      {/* </Paper> */}
    </>
  )
}

export default HoverEffect
