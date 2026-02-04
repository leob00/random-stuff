'use client'
import { Button, ButtonProps } from '@mui/material'

type ButtonAttributes = ButtonProps & {
  text: string
  onClicked?: () => void
  width?: number
  isDisabled?: boolean
}
const PassiveButton: React.FC<ButtonAttributes> = ({ text, isDisabled, onClicked, width = 100, ...props }) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Button variant='outlined' color='secondary' onClick={handleClick} disabled={isDisabled} {...props} sx={{ width: width }}>
      {`${text}`}
    </Button>
  )
}

export default PassiveButton
