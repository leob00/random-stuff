import { Box, Button, ButtonProps } from '@mui/material'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import React, { ReactNode } from 'react'

interface CustomProps {
  children: ReactNode
}

const TabButton = ({ children, ...props }: CustomProps & ButtonProps) => {
  return (
    <Button {...props} variant='text' color='primary'>
      <Box sx={{ border: `1px solid ${CasinoBlueTransparent}`, borderRadius: 2 }} p={1}>
        {children}
      </Box>
    </Button>
  )
}

export default TabButton
