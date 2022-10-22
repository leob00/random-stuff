import { Button, ButtonProps } from '@mui/material'
import React, { ReactNode } from 'react'

type ButtonAttributes = ButtonProps & {
  text: string
  onClicked?: () => void
  isDisabled?: boolean
}
const DangerButton: React.FC<ButtonAttributes> = ({ text, isDisabled, onClicked, ...props }) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Button variant='contained' color='error' onClick={handleClick} disabled={isDisabled} {...props} sx={{ minWidth: 100 }}>
      {`${text}`}
    </Button>
  )
}

export default DangerButton
