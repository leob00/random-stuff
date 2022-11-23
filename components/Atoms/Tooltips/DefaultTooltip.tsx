import Tooltip from '@mui/material/Tooltip'
import React, { ReactElement, ReactNode } from 'react'

const DefaultTooltip = ({ children, text, placement = 'top' }: { children: ReactElement<any, any>; text: string; placement?: string }) => {
  return (
    <Tooltip title={text} arrow placement='top' color='secondary'>
      {children}
    </Tooltip>
  )
}

export default DefaultTooltip
