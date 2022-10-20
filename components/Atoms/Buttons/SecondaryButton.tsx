import { Button, ButtonProps } from '@mui/material'
import React, { ReactNode } from 'react'

type ButtonAttributes = ButtonProps & {
  text?: string
  onClicked?: () => void
  isDisabled?: boolean
}
const SecondaryButton: React.FC<ButtonAttributes> = ({ text, isDisabled, onClicked, ...props }) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Button variant='contained' color='secondary' onClick={handleClick} disabled={isDisabled} {...props}>
      {`${text}`}
    </Button>
  )
}

export default SecondaryButton
