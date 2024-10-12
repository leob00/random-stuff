import React, { ReactNode } from 'react'
import { Button, ButtonProps } from '@mui/material'

const LinkButton = ({
  children,
  onClick,
  props,
  disabled,
  underline,
}: {
  children: ReactNode | JSX.Element[]
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void
  props?: ButtonProps
  disabled?: boolean
  underline?: boolean
}) => {
  //const color = props.color
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick(e)
  }
  return (
    <Button disabled={disabled} {...props} color={'secondary'} variant='text' onClick={handleClick} sx={{ textDecoration: underline ? 'underline' : 'unset' }}>
      {children}
    </Button>
  )
}

export default LinkButton
