import { Box } from '@mui/material'
import React, { ReactNode } from 'react'

const Clickable = ({ children, onClicked }: { children: ReactNode | React.JSX.Element; onClicked: () => void }) => {
  return (
    <Box sx={{ cursor: 'pointer' }} onClick={onClicked}>
      {children}
    </Box>
  )
}

export default Clickable
