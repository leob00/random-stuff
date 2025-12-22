'use client'
import { Box, BoxProps } from '@mui/material'
import { useViewPortSize } from 'hooks/ui/useViewportSize'
import { JSX, ReactElement, ReactNode, useRef } from 'react'

interface ComponentProps extends BoxProps {
  children: React.ReactNode | JSX.Element[]
}

const ScrollableBoxHorizontal = ({ children, maxWidth }: { children: ReactNode | ReactElement[]; maxWidth?: number }) => {
  const boxRef = useRef<HTMLDivElement | null>(null)

  return (
    <Box ref={boxRef} sx={{ maxWidth: { xs: 365, sm: 400 }, overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
      {children}
    </Box>
  )
}

export default ScrollableBoxHorizontal
