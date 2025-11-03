import { Button, ButtonProps } from '@mui/material'

type ButtonAttributes = ButtonProps & {
  text: string
  onClicked?: () => void
  isDisabled?: boolean
  loading?: boolean
}
const SuccessButton: React.FC<ButtonAttributes> = ({ text, isDisabled, onClicked, ...props }) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Button variant='contained' color={'success'} onClick={handleClick} disabled={isDisabled} {...props} sx={{ minWidth: 100 }}>
      {`${text}`}
    </Button>
  )
}

export default SuccessButton
