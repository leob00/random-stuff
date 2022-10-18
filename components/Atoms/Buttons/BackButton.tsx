import { Button } from '@mui/material'
import router from 'next/router'
import React from 'react'

const BackButton = ({ onClicked }: { onClicked?: () => void }) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Button variant='text' onClick={handleClick}>
      &#8592; back
    </Button>
  )
}

export default BackButton
