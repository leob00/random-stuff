import { Box, Tooltip } from '@mui/material'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import React from 'react'
import DefaultTooltip from './DefaultTooltip'

const ExpirationWarningTooltip = ({ children, expirationDt }: { children: any; expirationDt?: string }) => {
  return (
    <DefaultTooltip
      text={
        !expirationDt
          ? 'This record is set to expire expire about 3 days after it was created. If you want to save it forever, please edit it in your notes and re-save it.'
          : `This record is set to expire expire on ${dayjs(expirationDt).format('MM/DD/YYYY hh:mm a')}`
      }
    >
      <Box color={'secondary'}>{children}</Box>
    </DefaultTooltip>
  )
}

export default ExpirationWarningTooltip
