import { Button, ButtonProps } from '@mui/material'
import React, { ReactNode } from 'react'

type ButtonAttributes = ButtonProps & {
  text: string
  onClicked?: () => void
  width?: number
  isDisabled?: boolean
}
const SecondaryButton: React.FC<ButtonAttributes> = ({ text, isDisabled, onClicked, width = 110, ...props }) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Button variant='contained' color='secondary' onClick={handleClick} disabled={isDisabled} {...props} sx={{ minWidth: width, width: width }}>
      {`${text}`}
    </Button>
  )
}

export default SecondaryButton
