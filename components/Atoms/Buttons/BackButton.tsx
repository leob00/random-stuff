import { Button } from '@mui/material'
import React from 'react'

const BackButton = ({ onClicked }: { onClicked: () => void }) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Button variant='text' onClick={handleClick} color='primary'>
      &#8592; back
    </Button>
  )
}

export default BackButton
