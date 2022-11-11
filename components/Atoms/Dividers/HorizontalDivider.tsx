import { Box } from '@mui/material'
import { CasinoBlueTransparent, CasinoGrayTransparent, DarkBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const HorizontalDivider = () => {
  return <Box sx={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: CasinoGrayTransparent }}></Box>
}

export default HorizontalDivider
