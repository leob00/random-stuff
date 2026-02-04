'use client'
import { Button, ButtonProps } from '@mui/material'

type ButtonAttributes = ButtonProps & {
  text: string
  isDisabled?: boolean
}
const WarningButton = ({ ...props }: ButtonAttributes) => {
  const handleClick = () => {}

  return (
    <Button
      variant='contained'
      color={'warning'}
      onClick={() => {
        handleClick
      }}
      {...props}
      sx={{ minWidth: 100 }}
    >
      {`${props.text}`}
    </Button>
  )
}

export default WarningButton
