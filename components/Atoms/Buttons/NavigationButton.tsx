import React from 'react'
import { Button, Typography } from '@mui/material'
import router from 'next/router'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { useSessionController } from 'hooks/sessionController'

const NavigationButton = ({ text, route }: { text: string; route: string }) => {
  const sessionController = useSessionController()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!route.includes('/login')) {
      sessionController.setLastPath(route)
    }
    router.push(route)
  }
  return (
    <Button color={'secondary'} variant='text' onClick={handleClick}>
      <Typography variant={'h4'} color={CasinoBlueTransparent}>
        {text}
      </Typography>
    </Button>
  )
}

export default NavigationButton
