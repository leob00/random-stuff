import React, { ReactNode } from 'react'
import { Button, Typography } from '@mui/material'
import router from 'next/router'

const NavigationButton = ({ text, route }: { text: string; route: string }) => {
  //const color = props.color

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    router.push(route)
  }
  return (
    <Button color={'secondary'} variant='text' onClick={handleClick}>
      <Typography variant={'h4'}>{text}</Typography>
    </Button>
  )
}

export default NavigationButton