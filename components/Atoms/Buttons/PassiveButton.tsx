import { Button, ButtonProps } from '@mui/material'
import { CasinoBlackTransparent } from 'components/themes/mainTheme'
import React, { ReactNode } from 'react'

type ButtonAttributes = ButtonProps & {
  text: string
  onClicked?: () => void
  isDisabled?: boolean
}
const PassiveButton: React.FC<ButtonAttributes> = ({ text, isDisabled, onClicked, ...props }) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Button variant='contained' color='info' onClick={handleClick} disabled={isDisabled} {...props} sx={{ minWidth: 100 }}>
      {`${text}`}
    </Button>
  )
}

export default PassiveButton
