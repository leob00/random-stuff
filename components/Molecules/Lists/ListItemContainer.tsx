import { Stack, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'

const ListItemContainer = ({ children }: { children: ReactNode | React.JSX.Element[] }) => {
  const theme = useTheme()
  return <Stack>{children}</Stack>
}

export default ListItemContainer
