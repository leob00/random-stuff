import { Box, Tooltip } from '@mui/material'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const ExprationWarningTooltip = ({ children }: { children: any }) => {
  return (
    <Tooltip
      arrow
      title='This record will expire after about 3 days. If you want to save it forever, please edit it in your notes and re-save it.'
      placement='top'
      color='secondary'
      //sx={{ backgroundColor: CasinoBlueTransparent }}
    >
      <Box color={'secondary'}>{children}</Box>
    </Tooltip>
  )
}

export default ExprationWarningTooltip
