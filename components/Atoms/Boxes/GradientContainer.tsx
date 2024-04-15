import React, { ReactNode } from 'react'
import styled from '@emotion/styled'
import { Box, useTheme } from '@mui/material'
const Gradient = styled.div`
  background-image: linear-gradient(
    90deg,
    hsl(219deg 84% 15%) 0%,
    hsl(221deg 52% 32%) 18%,
    hsl(220deg 46% 50%) 38%,
    hsl(220deg 46% 50%) 61%,
    hsl(221deg 52% 32%) 82%,
    hsl(219deg 84% 15%) 100%
  );
`
const GradientContainer = ({ children }: { children: ReactNode }) => {
  const theme = useTheme()
  return (
    <Box>
      <Gradient>{children}</Gradient>
    </Box>
  )
}

export default GradientContainer
