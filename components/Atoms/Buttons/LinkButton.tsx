import React, { ReactNode } from 'react'
import { Button } from '@mui/material'

import { ButtonProps } from '@mui/material'
import { Blue800 } from 'components/themes/mainTheme'

const LinkButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button {...props} sx={{ boxShadow: 0, color: 'primary' }} variant='text'>
      {children}
    </Button>
  )
}

LinkButton.defaultProps = {}

export default LinkButton
