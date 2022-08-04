import { Button } from '@mui/material'
import router from 'next/router'
import React from 'react'

const BackToHomeButton = () => {
  return (
    <Button
      variant='text'
      onClick={() => {
        router.push('/')
      }}>
      &#8592; back
    </Button>
  )
}

export default BackToHomeButton
