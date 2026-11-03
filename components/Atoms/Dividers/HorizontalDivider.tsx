'use client'
import { Box, useTheme } from '@mui/material'
import { CasinoBlueTransparent, VeryLightBlueTransparent } from 'components/themes/mainTheme'

const HorizontalDivider = () => {
  const theme = useTheme()
  const color = theme.palette.mode === 'dark' ? theme.palette.info.dark : theme.palette.primary.light
  return <Box mb={'6px'} mt={'6px'} sx={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: color }}></Box>
}

export default HorizontalDivider
