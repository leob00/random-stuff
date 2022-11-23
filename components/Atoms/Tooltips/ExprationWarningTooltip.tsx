import { Box, Tooltip } from '@mui/material'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import React from 'react'

const ExprationWarningTooltip = ({ children, expirationDt }: { children: any; expirationDt?: string }) => {
  return (
    <Tooltip
      arrow
      placement='top'
      color='secondary'
      title={
        !expirationDt
          ? 'This record is set to expire expire about 3 days after it was created. If you want to save it forever, please edit it in your notes and re-save it.'
          : `This record is set to expire expire on ${dayjs(expirationDt).format('MM/DD/YYYY hh:mm a')}`
      }

      //sx={{ backgroundColor: CasinoBlueTransparent }}
    >
      <Box color={'secondary'}>{children}</Box>
    </Tooltip>
  )
}

export default ExprationWarningTooltip
