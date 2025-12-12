import { Box } from '@mui/material'
import { ReactElement, ReactNode, useRef } from 'react'

const ScrollableBoxHorizontal = ({ children, maxWidth }: { children: ReactNode | ReactElement[]; maxWidth: number }) => {
  const boxRef = useRef<HTMLDivElement | null>(null)

  return (
    <Box
      ref={boxRef}
      //width={'100%'}
      sx={{ maxWidth: maxWidth, overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
    >
      {children}
    </Box>
  )
}

export default ScrollableBoxHorizontal
