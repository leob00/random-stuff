import { Box } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const HorizontalDivider = () => {
  return <Box mb={'6px'} mt={'6px'} sx={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: VeryLightBlueTransparent }}></Box>
}

export default HorizontalDivider
