import React, { ReactNode } from 'react'
import { Button, ButtonProps, Typography } from '@mui/material'

const LinkButton = ({
  children,
  onClick,
  props,
  disabled,
  underline,
}: {
  children: ReactNode | React.JSX.Element[]
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void
  props?: ButtonProps
  disabled?: boolean
  underline?: boolean
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick(e)
  }
  return (
    <Button disabled={disabled} {...props} color={'primary'} variant='text' onClick={handleClick} sx={{ textDecoration: underline ? 'underline' : 'unset' }}>
      <Typography variant='body2'>{children}</Typography>
    </Button>
  )
}

export default LinkButton
