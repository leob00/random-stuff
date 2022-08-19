import { Button } from '@mui/material'
import React from 'react'

const PrimaryButton = ({ text, isDisabled, onClicked }: { text: string; isDisabled: boolean | undefined; onClicked?: () => void }) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Button variant='contained' color='primary' onClick={handleClick} disabled={isDisabled}>
      {`${text}`}
    </Button>
  )
}

export default PrimaryButton
