import { Button, ButtonProps } from '@mui/material'
import React, { ReactNode } from 'react'

type ButtonAttributes = ButtonProps & {
  text: string
  onClicked?: () => void
  width?: number
  isDisabled?: boolean
}
const DangerButton: React.FC<ButtonAttributes> = ({ text, isDisabled, onClicked, width = 110, ...props }) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Button variant='contained' color='error' onClick={handleClick} disabled={isDisabled} {...props} sx={{ width: width }}>
      {`${text}`}
    </Button>
  )
}

export default DangerButton
