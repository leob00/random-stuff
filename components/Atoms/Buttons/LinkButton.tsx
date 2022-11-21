import React, { ReactNode } from 'react'
import { Button } from '@mui/material'

import { ButtonProps } from '@mui/material'
import { Blue800 } from 'components/themes/mainTheme'

const LinkButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  const color = props.color
  return (
    <Button {...props} color={color ? color : 'secondary'} variant='text'>
      {children}
    </Button>
  )
}

LinkButton.defaultProps = {}

export default LinkButton
