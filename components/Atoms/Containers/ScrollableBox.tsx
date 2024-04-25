import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { Box } from '@mui/material'
import React, { ReactNode } from 'react'

const ScrollableBox = ({ children }: { children: ReactNode | ReactJSXElement }) => {
  return <Box sx={{ my: 2, maxHeight: 640, overflowY: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitScrollSnapType: 'none' }}>{children}</Box>
}

export default ScrollableBox
