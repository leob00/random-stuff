'use client'
import React, { ReactNode } from 'react'
import { Box, Button, ButtonProps, Typography } from '@mui/material'

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
      <Box>{children}</Box>
    </Button>
  )
}

export default LinkButton
