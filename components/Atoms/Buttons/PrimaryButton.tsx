import { Button, ButtonProps } from '@mui/material'
import React from 'react'

type ButtonAttributes = ButtonProps & {
  text: string
  onClicked?: () => void
  isDisabled?: boolean
}
const PrimaryButton: React.FC<ButtonAttributes> = ({ text, isDisabled, onClicked, ...props }) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Button variant='contained' color='primary' onClick={handleClick} disabled={isDisabled} {...props} sx={{ minWidth: 100 }}>
      {`${text}`}
    </Button>
  )
}

export default PrimaryButton
