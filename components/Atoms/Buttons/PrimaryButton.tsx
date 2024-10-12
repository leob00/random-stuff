import { Button, ButtonProps } from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material'

type ButtonAttributes = ButtonProps & {
  text: string
  onClicked?: () => void
  isDisabled?: boolean
  variant?: 'text' | 'contained' | 'outlined'
}
const PrimaryButton: React.FC<ButtonAttributes> = ({ text, isDisabled, variant, onClicked, ...props }) => {
  const theme = useTheme()
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Button
      variant={variant ?? 'contained'}
      color={theme.palette.mode === 'light' ? 'primary' : 'info'}
      onClick={handleClick}
      disabled={isDisabled}
      {...props}
      sx={{ minWidth: 100 }}
    >
      {`${text}`}
    </Button>
  )
}

export default PrimaryButton
