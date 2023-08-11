import React from 'react'
import { Button, Typography } from '@mui/material'
import router from 'next/router'
import { CasinoBlueTransparent, VeryLightBlue } from 'components/themes/mainTheme'
import BackdropLoader from '../Loaders/BackdropLoader'
import { useTheme } from '@mui/material'

const NavigationButton = ({ text, route }: { text: string; route: string }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const theme = useTheme()
  const color = theme.palette.mode === 'dark' ? VeryLightBlue : CasinoBlueTransparent
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true)
    router.push(route)
  }
  return (
    <>
      {isLoading && <BackdropLoader />}
      <Button color={'secondary'} variant='text' onClick={handleClick}>
        <Typography variant={'h4'} color={color}>
          {text}
        </Typography>
      </Button>
    </>
  )
}

export default NavigationButton
