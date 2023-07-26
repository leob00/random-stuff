import React, { ReactNode } from 'react'
import { Button, ButtonProps } from '@mui/material'

const LinkButton = ({ children, onClick, props }: { children: ReactNode; onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void; props?: ButtonProps }) => {
  //const color = props.color
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick(e)
  }
  return (
    <Button {...props} color={'secondary'} variant='text' onClick={handleClick}>
      {children}
    </Button>
  )
}

export default LinkButton
