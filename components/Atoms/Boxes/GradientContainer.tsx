'use client'
import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { Box, useTheme } from '@mui/material'
const Gradient = styled.div`
  background-image: linear-gradient(
    50deg,
    hsl(217deg 94% 6%) 0%,
    hsl(217deg 81% 15%) 10%,
    hsl(219deg 69% 23%) 20%,
    hsl(220deg 58% 31%) 29%,
    hsl(220deg 50% 37%) 39%,
    hsl(220deg 50% 37%) 49%,
    hsl(220deg 50% 37%) 58%,
    hsl(220deg 50% 37%) 67%,
    hsl(220deg 58% 31%) 76%,
    hsl(219deg 69% 23%) 85%,
    hsl(217deg 81% 15%) 93%,
    hsl(217deg 94% 6%) 100%
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
