import Tooltip from '@mui/material/Tooltip'
import React, { ReactElement } from 'react'

const DefaultTooltip = ({ children, text, color = 'secondary', placement = 'top' }: { children: ReactElement<any, any>; text: string; color?: 'success' | 'secondary' | 'info' | 'primary'; placement?: string }) => {
  return (
    <Tooltip title={text} arrow placement='top' color={color}>
      {children}
    </Tooltip>
  )
}

export default DefaultTooltip
