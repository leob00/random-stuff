import { Box } from '@mui/material'
import { CasinoBlueTransparent, CasinoGrayTransparent, DarkBlueTransparent, LightBlue, VeryLightBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const HorizontalDivider = () => {
  return <Box mb={1} mt={1} sx={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: VeryLightBlueTransparent }}></Box>
}

export default HorizontalDivider
