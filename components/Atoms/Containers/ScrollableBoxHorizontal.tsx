import { Box, BoxProps } from '@mui/material'
import { JSX, ReactElement, ReactNode, useRef } from 'react'

interface ComponentProps extends BoxProps {
  children: React.ReactNode | JSX.Element[]
}

const ScrollableBoxHorizontal = ({ children, maxWidth }: { children: ReactNode | ReactElement[]; maxWidth: number }) => {
  const boxRef = useRef<HTMLDivElement | null>(null)

  return (
    <Box
      ref={boxRef}
      //width={'100%'}
      sx={{ maxWidth: { xs: 334, sm: maxWidth }, overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
    >
      {children}
    </Box>
  )
}

export default ScrollableBoxHorizontal
