import { Box, BoxProps } from '@mui/material'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { JSX, ReactNode } from 'react'

interface ComponentProps extends BoxProps {
  children: React.ReactNode | JSX.Element[]
}

const BorderedBox = ({ ...props }: ComponentProps) => {
  return (
    <Box {...props} py={2} px={1} sx={{ border: `solid ${CasinoBlueTransparent} 1px` }} borderRadius={2}>
      {props.children}
    </Box>
  )
}

export default BorderedBox
