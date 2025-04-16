import { Button, ButtonProps, useTheme } from '@mui/material'
import React from 'react'

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
  const theme = useTheme()
  return (
    <Button variant='contained' color={'error'} onClick={handleClick} disabled={isDisabled} {...props} sx={{ minWidth: width }}>
      {`${text}`}
    </Button>
  )
}

export default DangerButton
