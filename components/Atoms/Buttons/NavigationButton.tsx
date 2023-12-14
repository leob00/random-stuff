import React from 'react'
import { Button, Typography } from '@mui/material'
import router from 'next/router'
import BackdropLoader from '../Loaders/BackdropLoader'
import { useTheme } from '@mui/material'

const NavigationButton = ({ text, route }: { text: string; route: string }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true)
    router.push(route)
  }
  return (
    <>
      {isLoading && <BackdropLoader />}
      <Button variant='text' onClick={handleClick}>
        <Typography variant={'h4'}>{text}</Typography>
      </Button>
    </>
  )
}

export default NavigationButton
