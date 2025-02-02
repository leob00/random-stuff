import { Stack, useTheme } from '@mui/material'
import { DarkBlue, ChartBackground } from 'components/themes/mainTheme'
import React, { ReactNode } from 'react'

const ListItemContainer = ({ children }: { children: ReactNode | JSX.Element[] }) => {
  const theme = useTheme()
  return <Stack>{children}</Stack>
}

export default ListItemContainer
