import React from 'react'
import { Button, Typography } from '@mui/material'
import router from 'next/router'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import BackdropLoader from '../Loaders/BackdropLoader'

const NavigationButton = ({ text, route }: { text: string; route: string }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true)
    router.push(route)
  }
  return (
    <>
      {isLoading && <BackdropLoader />}
      <Button color={'secondary'} variant='text' onClick={handleClick}>
        <Typography variant={'h4'} color={CasinoBlueTransparent}>
          {text}
        </Typography>
      </Button>
    </>
  )
}

export default NavigationButton
