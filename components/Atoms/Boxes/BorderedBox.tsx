import { Box, BoxProps } from '@mui/material'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { JSX, ReactNode } from 'react'

interface ComponentProps extends BoxProps {
  // Your specific "Blox Props" go here

  children: React.ReactNode | JSX.Element[]
}

const BorderedBox = ({ ...props }: ComponentProps) => {
  return (
    <Box {...props} py={2} px={2} sx={{ border: `solid ${CasinoBlueTransparent} 1px` }} borderRadius={2}>
      {props.children}
    </Box>
  )
}

export default BorderedBox
